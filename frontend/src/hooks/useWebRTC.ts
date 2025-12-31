import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const STUN_SERVERS = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
};

export const useWebRTC = (roomId: string) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerId, setPeerId] = useState<string | null>(null); // The other user's socket ID

    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        // 1. Initialize Socket Connection
        socketRef.current = io("http://localhost:5001");

        socketRef.current.on("connect", () => {
            console.log("Connected to signaling server ID:", socketRef.current?.id);
            socketRef.current?.emit("join-room", roomId);
        });

        // Initiator logic: When a new user connects, we call them
        socketRef.current.on("user-connected", async (userId) => {
            console.log("New user connected:", userId);
            setPeerId(userId); // Track who we are talking to
            await createOffer(userId);
        });

        // Receiver logic
        socketRef.current.on("offer", async (payload) => {
            console.log("Received offer from:", payload.caller);
            setPeerId(payload.caller); // Track who called us
            await handleOffer(payload);
        });

        socketRef.current.on("answer", async (payload) => {
            console.log("Received answer from:", payload.caller);
            await handleAnswer(payload);
        });

        socketRef.current.on("ice-candidate", async (payload) => {
            // console.log("Received ICE candidate");
            await handleIceCandidate(payload);
        });

        // 2. Initialize Peer Connection
        const pc = new RTCPeerConnection(STUN_SERVERS);
        peerConnectionRef.current = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                // We need to know who to send this to. 
                // If we have peerId, send to them.
                // NOTE: This relies on peerId being set by either user-connected or offer/answer
                // For the very first candidate, it might race if peerId isn't set?
                // Actually, ICE candidates gather after setLocalDescription.
                // By then, we should know the peerId if we are the caller (from user-connected)
                // or if we are the receiver (from offer).

                // However, there's a scope issue: 'peerId' state might not be updated inside this callback 
                // due to closure if we use the state variable directly.
                // Better to use a ref for peerId or pass it through.
                // For simplicity here, we might need a ref for peerId.
            }
        };

        pc.ontrack = (event) => {
            console.log("Received remote track");
            setRemoteStream(event.streams[0]);
        };

        return () => {
            socketRef.current?.disconnect();
            peerConnectionRef.current?.close();
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [roomId]);

    // Use a ref to track peerId for callbacks
    const peerIdRef = useRef<string | null>(null);
    useEffect(() => { peerIdRef.current = peerId; }, [peerId]);

    // Re-bind onicecandidate when peerId changes? No, better to use the Ref inside the static callback.
    useEffect(() => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate && peerIdRef.current && socketRef.current) {
                    socketRef.current.emit("ice-candidate", {
                        target: peerIdRef.current,
                        candidate: event.candidate,
                    });
                }
            };
        }
    }, [peerConnectionRef.current]); // Re-bind if PC changes (it's stable though)


    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            // Add tracks to PeerConnection
            if (peerConnectionRef.current) {
                stream.getTracks().forEach((track) => {
                    peerConnectionRef.current?.addTrack(track, stream);
                });
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const createOffer = async (targetUserId: string) => {
        if (!peerConnectionRef.current) return;

        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            socketRef.current?.emit("offer", {
                target: targetUserId,
                sdp: offer
            });
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    };

    const handleOffer = async (payload: { sdp: RTCSessionDescriptionInit, caller: string }) => {
        if (!peerConnectionRef.current) return;

        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socketRef.current?.emit("answer", {
                target: payload.caller,
                sdp: answer
            });
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    };

    const handleAnswer = async (payload: { sdp: RTCSessionDescriptionInit }) => {
        if (!peerConnectionRef.current) return;
        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        } catch (err) {
            console.error("Error handling answer:", err);
        }
    };

    const handleIceCandidate = async (payload: { candidate: RTCIceCandidateInit }) => {
        if (!peerConnectionRef.current) return;
        try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (err) {
            console.error("Error adding ice candidate:", err);
        }
    };

    const toggleAudio = (enabled: boolean) => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = enabled);
        }
    }

    const toggleVideo = (enabled: boolean) => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = enabled);
        }
    }

    return {
        localStream,
        remoteStream,
        startLocalStream,
        toggleAudio,
        toggleVideo,
        peerId
    };
};
