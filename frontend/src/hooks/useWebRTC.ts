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
            // We wait for localStream to be ready before joining
        });

        // Initiator logic: When a new user connects, we call them
        socketRef.current.on("user-connected", async (userId) => {
            console.log("New user connected:", userId);
            setPeerId(userId);
            peerIdRef.current = userId; // Update ref immediately to avoid race condition
            await createOffer(userId);
        });

        // Receiver logic
        socketRef.current.on("offer", async (payload) => {
            console.log("Received offer from:", payload.caller);
            setPeerId(payload.caller);
            peerIdRef.current = payload.caller; // Update ref immediately
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
            if (event.candidate && socketRef.current && peerIdRef.current) {
                console.log("Sending ICE candidate to:", peerIdRef.current);
                socketRef.current.emit("ice-candidate", {
                    target: peerIdRef.current,
                    candidate: event.candidate,
                });
            } else {
                console.warn("ICE candidate generated but not sent. socket:", !!socketRef.current, "peerId:", peerIdRef.current);
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

    // We update peerIdRef manually in the socket handlers above to avoid race conditions.
    // No need for useEffect synchronization here for the critical path.


    // Track if we have joined the room to prevent duplicates
    const hasJoinedRoom = useRef(false);

    // Reset joined state when roomId changes
    useEffect(() => {
        hasJoinedRoom.current = false;
    }, [roomId]);

    // Join room only after local stream is ready to ensure tracks are added to PC
    useEffect(() => {
        if (localStream && socketRef.current?.connected && !hasJoinedRoom.current) {
            console.log("Local stream ready, joining room:", roomId);
            socketRef.current.emit("join-room", roomId);
            hasJoinedRoom.current = true;
        }
    }, [localStream, roomId]); // socketRef is stable, but we check connected property
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
