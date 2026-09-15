import { loginUser, registerUser, refreshAccessToken  } from "./auth.service.js"


export const register = async (req, res, next) => {
    try {
     const user = await registerUser(req.body, req.file)

     res.status(200).json({
        succes: true,
        message: 'User Registered Successfully',
        user
     })

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
    const result = await loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        user: result.user,
        accessToken: result.accessToken,
    }); 

    } catch (error) {
        next(error)
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

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
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};