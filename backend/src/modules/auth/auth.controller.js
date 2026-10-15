import { loginUser, registerUser, refreshAccessToken  } from "./auth.service.js"
import { refreshCookieOptions } from "../../config/cookie-options.js"

export const register = async (req, res, next) => {
    try {
     const user = await registerUser(req.body, req.file)

     res.status(200).json({
        succes: true,
        message: 'User Registered Successfully',
        user
     })

    } catch (error) {
        res.status(400).json({
            success: true,
            message: error.message
        })
    }
}

export const login = async (req, res, next) => {
    try {
    const result = await loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    return res.status(200).json({
        success: true,
        user: result.user,
        accessToken: result.accessToken,
    }); 

    } catch (error) {
        res.status(400).json({
            success: true,
            message: error.message
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
       
        if (!token) {
          return res.status(401).json({
            success: false,
            message: "Refresh token is missing",
          });
        }
        const accessToken = await refreshAccessToken(token);
        
        return res.status(200).json({
            success: true,
            accessToken,
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
};

export const logout = async (req, res) => {
    res.clearCookie("refreshToken", refreshCookieOptions)

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};