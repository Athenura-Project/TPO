


import bcrypt from "bcrypt";

// 🔐 Hash Password
export const HashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Error hashing password");
    }
};

// 🔍 Compare Password
export const ComparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error comparing password");
    }
};
