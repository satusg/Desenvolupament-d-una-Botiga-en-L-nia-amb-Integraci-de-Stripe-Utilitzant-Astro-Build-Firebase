import { auth } from "@/firebase/config";
import { signInAnonymously } from "firebase/auth";

export const getCurrentUser = () => auth?.currentUser;
export const singInAnonymous = async () => signInAnonymously(auth);
export const getIsAnonymous = () => auth?.currentUser?.isAnonymous;
export const authenticateForCart = async () => {
    let currentUser = getCurrentUser();
    if (!currentUser) {
        await singInAnonymous();
        currentUser = getCurrentUser();
    }
    return currentUser
}