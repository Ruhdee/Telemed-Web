import { spawn } from 'child_process';
import { error } from 'console';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Python Path explicitly to avoid ENOENT issues
const PYTHON_PATH = '/usr/bin/python3';

// Heart Disease Prediction
export const predictHeartDisease = async (req, res) => {
  try {
    console.log('Heart disease prediction request:', req.body);
    console.log('Model Status: Starting Heart Disease prediction...');

    const { age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, ca, thal, slope } = req.body;

    // Validate required fields - use defaults for missing optional fields
    const requiredFields = [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak];
    if (requiredFields.some(field => field === undefined || field === null)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Path to Python script
    const heartDir = path.join(__dirname, '../models/HDP model');
    const pythonScript = path.join(heartDir, 'HDP_prediction.py');

    // Prepare input data with defaults for missing fields
    const inputData = [
      age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak,
      slope || 0, ca || 0, thal || 0
    ];

    // Run Python script from heart directory
    const python = spawn(PYTHON_PATH, [pythonScript, ...inputData.map(String)], {
      cwd: heartDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Heart prediction - Python output:', result);
      console.log('Heart prediction - Python stderr:', error);
      console.log('Heart prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script error:', error);
        console.log('Model Status: Heart Disease prediction failed.');
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Prediction failed', details: error });
        }
        return;
      }

      console.log('Model Status: Heart Disease prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Heart prediction - Parsed result:', prediction);
        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw result:', result);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to parse prediction result', raw: result });
        }
      }
    });

  } catch (error) {
    console.error('Heart disease prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Diabetes Prediction
export const predictDiabetes = async (req, res) => {
  try {
    console.log('Diabetes prediction request:', req.body);
    console.log('Model Status: Starting Diabetes prediction...');

    const { Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age } = req.body;

    // Validate required fields
    const requiredFields = [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age];
    if (requiredFields.some(field => field === undefined || field === null)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Path to Python script and working directory
    const diabetesMlDir = path.join(__dirname, '../models/diabetes-ml');
    const pythonScript = path.join(diabetesMlDir, 'src/predict_single.py');

    // Prepare input data
    const inputData = [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age];

    // Run Python script from diabetes-ml directory
    const python = spawn(PYTHON_PATH, [pythonScript, ...inputData.map(String)], {
      cwd: diabetesMlDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Diabetes prediction - Python output:', result);
      console.log('Diabetes prediction - Python stderr:', error);
      console.log('Diabetes prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script error:', error);
        console.log('Model Status: Diabetes prediction failed.');
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Prediction failed', details: error });
        }
        return;
      }

      console.log('Model Status: Diabetes prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Diabetes prediction - Parsed result:', prediction);
        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw result:', result);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to parse prediction result', raw: result });
        }
      }
    });

  } catch (error) {
    console.error('Diabetes prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const predictLiver = async (req, res) => {
  try {
    console.log('Liver disease prediction request:', req.body);
    console.log('Model Status: Starting Liver Disease prediction...');

    const { age, gender, total_bilirubin, direct_bilirubin, alkphos, sgpt, sgot, total_proteins, albumin, ag_ratio } = req.body;

    // Validate required fields
    const requiredFields = [age, gender, total_bilirubin, direct_bilirubin, alkphos, sgpt, sgot, total_proteins, albumin, ag_ratio];
    if (requiredFields.some(field => field === undefined || field === null)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Path to Python script
    const liverDir = path.join(__dirname, '../models/lpd model');
    const pythonScript = path.join(liverDir, 'predict_liver_single.py');

    // Prepare input data
    const inputData = [age, gender, total_bilirubin, direct_bilirubin, alkphos, sgpt, sgot, total_proteins, albumin, ag_ratio];

    // Run Python script from liver directory
    const python = spawn(PYTHON_PATH, [pythonScript, ...inputData.map(String)], {
      cwd: liverDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Liver prediction - Python output:', result);
      console.log('Liver prediction - Python stderr:', error);
      console.log('Liver prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script error:', error);
        console.log('Model Status: Liver Disease prediction failed.');
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Prediction failed', details: error });
        }
        return;
      }

      console.log('Model Status: Liver Disease prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Liver prediction - Parsed result:', prediction);
        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw result:', result);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to parse prediction result', raw: result });
        }
      }
    });

  } catch (error) {
    console.error('Liver prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const predictStroke = async (req, res) => {
  res.status(501).json({ error: 'Stroke prediction coming soon' });
};

export const predictCKD = async (req, res) => {
  try {
    console.log('CKD prediction request:', req.body);
    console.log('Model Status: Starting CKD prediction...');

    const { age, bp, sg, al, su, rbc, pc, pcc, ba, bgr, bu, sc, sod, pot, hemo, pcv, wc, rc, htn, dm, cad, appet, pe, ane } = req.body;

    // Validate required fields
    const requiredFields = [age, bp, sg, al, su, rbc, pc, pcc, ba, bgr, bu, sc, sod, pot, hemo, pcv, wc, rc, htn, dm, cad, appet, pe, ane];
    if (requiredFields.some(field => field === undefined || field === null)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Path to Python script
    const ckdDir = path.join(__dirname, '../models/CKD_Ml');
    const pythonScript = path.join(ckdDir, 'predict_ckd_single.py');

    // Prepare input data
    const inputData = [age, bp, sg, al, su, rbc, pc, pcc, ba, bgr, bu, sc, sod, pot, hemo, pcv, wc, rc, htn, dm, cad, appet, pe, ane];

    // Run Python script from CKD directory
    const python = spawn(PYTHON_PATH, [pythonScript, ...inputData.map(String)], {
      cwd: ckdDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('CKD prediction - Python output:', result);
      console.log('CKD prediction - Python stderr:', error);
      console.log('CKD prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script error:', error);
        console.log('Model Status: CKD prediction failed.');
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Prediction failed', details: error });
        }
        return;
      }

      console.log('Model Status: CKD prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('CKD prediction - Parsed result:', prediction);
        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw result:', result);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to parse prediction result', raw: result });
        }
      }
    });

  } catch (error) {
    console.error('CKD prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// CNN Model predictions (image-based)
export const predictTB = async (req, res) => {
  try {
    console.log('TB prediction request received');
    console.log('Model Status: Starting Tuberculosis prediction...');

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Path to Python script
    const tbDir = path.join(__dirname, '../models/TB-CNN-Pratyay');
    const pythonScript = path.join(tbDir, 'predict_tb_single.py');
    const imagePath = path.resolve(req.file.path);

    // Run Python script
    const python = spawn(PYTHON_PATH, [pythonScript, imagePath], {
      cwd: tbDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('TB prediction - Python output:', result);
      console.log('TB prediction - Python stderr:', error);
      console.log('TB prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script error:', error);
        console.log('Model Status: Tuberculosis prediction failed.');
        if (!res.headersSent) {
          return res.status(500).json({ error: 'Prediction failed', details: error });
        }
        return;
      }

      console.log('Model Status: Tuberculosis prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('TB prediction - Parsed result:', prediction);
        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw result:', result);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to parse prediction result', raw: result });
        }
      }
    });

  } catch (error) {
    console.error('TB prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const predictBrainTumor = async (req, res) => {
  try {
    console.log('Brain tumor prediction request received');
    console.log('Model Status: Starting Brain Tumor prediction...');

    if (!req.file) {
      return res.status(400).json({ error: 'MRI image file is required' });
    }

    // Path to Python script
    const mriDir = path.join(__dirname, '../models/mri model');
    const pythonScript = path.join(mriDir, 'predict_mri.py');
    const imagePath = path.resolve(req.file.path);

    // Run Python script
    const python = spawn(PYTHON_PATH, [pythonScript, imagePath], {
      cwd: mriDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Brain tumor prediction - Python output:', result);
      console.log('Brain tumor prediction - Python stderr:', error);
      console.log('Brain tumor prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script failed with exit code:', code);
        console.error('Error details:', error);
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'Brain tumor prediction failed',
            details: error,
            exitCode: code,
            imagePath: imagePath
          });
        }
        return;
      }

      if (!result || result.trim() === '') {
        console.error('Empty result from Python script');
        console.log('Model Status: Brain Tumor prediction failed (Empty Result).');
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'No prediction result received',
            stderr: error
          });
        }
        return;
      }

      console.log('Model Status: Brain Tumor prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Parsed prediction result:', prediction);

        if (prediction.error) {
          console.error('Prediction error from Python:', prediction.error);
          if (!res.headersSent) {
            return res.status(500).json({
              error: prediction.error,
              source: 'python_script'
            });
          }
          return;
        }

        if (!prediction.success) {
          console.error('Prediction not successful:', prediction);
          if (!res.headersSent) {
            return res.status(500).json({
              error: 'Prediction was not successful',
              details: prediction
            });
          }
          return;
        }

        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        console.error('Raw Python output:', result);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to parse prediction result',
            parseError: parseError.message,
            rawOutput: result.substring(0, 500) // Limit output size
          });
        }
      }
    });

  } catch (error) {
    console.error('Brain tumor prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const predictRetinopathy = async (req, res) => {
  try {
    console.log('Retinopathy prediction request received');
    console.log('Model Status: Starting Retinopathy prediction...');

    if (!req.file) {
      return res.status(400).json({ error: 'Retinal image file is required' });
    }

    // Path to Python script
    const retinoDir = path.join(__dirname, '../models/Retinopathy');
    const pythonScript = path.join(retinoDir, 'predict_retinopathy.py');
    const imagePath = path.resolve(req.file.path);

    // Run Python script
    const python = spawn(PYTHON_PATH, [pythonScript, imagePath], {
      cwd: retinoDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Retinopathy prediction - Python output:', result);
      console.log('Retinopathy prediction - Python stderr:', error);
      console.log('Retinopathy prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script failed with exit code:', code);
        console.error('Error details:', error);
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'Retinopathy prediction failed',
            details: error,
            exitCode: code,
            imagePath: imagePath
          });
        }
        return;
      }

      if (!result || result.trim() === '') {
        console.error('Empty result from Python script');
        console.log('Model Status: Retinopathy prediction failed (Empty Result).');
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'No prediction result received',
            stderr: error
          });
        }
        return;
      }

      console.log('Model Status: Retinopathy prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Parsed prediction result:', prediction);

        if (prediction.error) {
          console.error('Prediction error from Python:', prediction.error);
          if (!res.headersSent) {
            return res.status(500).json({
              error: prediction.error,
              source: 'python_script'
            });
          }
          return;
        }

        if (!prediction.success) {
          console.error('Prediction not successful:', prediction);
          if (!res.headersSent) {
            return res.status(500).json({
              error: 'Prediction was not successful',
              details: prediction
            });
          }
          return;
        }

        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        console.error('Raw Python output:', result);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to parse prediction result',
            parseError: parseError.message,
            rawOutput: result.substring(0, 500)
          });
        }
      }
    });

  } catch (error) {
    console.error('Retinopathy prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const predictPneumonia = async (req, res) => {
  try {
    console.log('Pneumonia prediction request received');
    console.log('Model Status: Starting Pneumonia prediction...');

    if (!req.file) {
      return res.status(400).json({ error: 'Chest X-ray image file is required' });
    }

    // Path to Python script
    const pneumoniaDir = path.join(__dirname, '../models/pneumonia');
    const pythonScript = path.join(pneumoniaDir, 'predict_pneumonia.py');
    const imagePath = path.resolve(req.file.path);

    console.log('Pneumonia prediction - Script path:', pythonScript);
    console.log('Pneumonia prediction - Image path:', imagePath);

    // Run Python script
    const python = spawn(PYTHON_PATH, [pythonScript, imagePath], {
      cwd: pneumoniaDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Pneumonia prediction - Python output:', result);
      console.log('Pneumonia prediction - Python stderr:', error);
      console.log('Pneumonia prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script failed with exit code:', code);
        console.error('Error details:', error);
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'Pneumonia prediction failed',
            details: error,
            exitCode: code,
            imagePath: imagePath
          });
        }
        return;
      }

      if (!result || result.trim() === '') {
        console.error('Empty result from Python script');
        console.log('Model Status: Pneumonia prediction failed (Empty Result).');
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'No prediction result received',
            stderr: error
          });
        }
        return;
      }

      console.log('Model Status: Pneumonia prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Parsed prediction result:', prediction);

        if (prediction.error) {
          console.error('Prediction error from Python:', prediction.error);
          if (!res.headersSent) {
            return res.status(500).json({
              error: prediction.error,
              source: 'python_script'
            });
          }
          return;
        }

        if (!prediction.success) {
          console.error('Prediction not successful:', prediction);
          if (!res.headersSent) {
            return res.status(500).json({
              error: 'Prediction was not successful',
              details: prediction
            });
          }
          return;
        }

        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        console.error('Raw Python output:', result);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to parse prediction result',
            parseError: parseError.message,
            rawOutput: result.substring(0, 500)
          });
        }
      }
    });

  } catch (error) {
    console.error('Pneumonia prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const predictSkinDisease = async (req, res) => {
  try {
    console.log('Skin disease prediction request received');
    console.log('Model Status: Starting Skin Disease prediction...');

    if (!req.file) {
      return res.status(400).json({ error: 'Skin image file is required' });
    }

    // Path to Python script
    const skinDir = path.join(__dirname, '../models/skin');
    const pythonScript = path.join(skinDir, 'predict.py');
    const imagePath = path.resolve(req.file.path);

    console.log('Skin disease prediction - Script path:', pythonScript);
    console.log('Skin disease prediction - Image path:', imagePath);

    // Run Python script
    const python = spawn(PYTHON_PATH, [pythonScript, imagePath], {
      cwd: skinDir
    });

    let result = '';
    let error = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to execute prediction model', details: err.message });
      }
    });

    python.on('close', (code) => {
      console.log('Skin disease prediction - Python output:', result);
      console.log('Skin disease prediction - Python stderr:', error);
      console.log('Skin disease prediction - Exit code:', code);

      if (code !== 0) {
        console.error('Python script failed with exit code:', code);
        console.error('Error details:', error);
        console.log('Model Status: Skin Disease prediction failed.');
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'Skin disease prediction failed',
            details: error,
            exitCode: code,
            imagePath: imagePath
          });
        }
        return;
      }

      if (!result || result.trim() === '') {
        console.error('Empty result from Python script');
        console.log('Model Status: Skin Disease prediction failed (Empty Result).');
        if (!res.headersSent) {
          return res.status(500).json({
            error: 'No prediction result received',
            stderr: error
          });
        }
        return;
      }

      console.log('Model Status: Skin Disease prediction completed.');

      try {
        const prediction = JSON.parse(result.trim());
        console.log('Parsed prediction result:', prediction);

        if (prediction.error) {
          console.error('Prediction error from Python:', prediction.error);
          if (!res.headersSent) {
            return res.status(500).json({
              error: prediction.error,
              source: 'python_script'
            });
          }
          return;
        }

        if (!prediction.success) {
          console.error('Prediction not successful:', prediction);
          if (!res.headersSent) {
            return res.status(500).json({
              error: 'Prediction was not successful',
              details: prediction
            });
          }
          return;
        }

        if (!res.headersSent) {
          res.json(prediction);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        console.error('Raw Python output:', result);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to parse prediction result',
            parseError: parseError.message,
            rawOutput: result.substring(0, 500)
          });
        }
      }
    });

  } catch (error) {
    console.error('Skin disease prediction error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};