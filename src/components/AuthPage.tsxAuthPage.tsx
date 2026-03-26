import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        alert("Verification email sent! Check your inbox.");
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        if (!userCred.user.emailVerified) {
          alert("Please verify your email first!");
          return;
        }

        alert("Login successful!");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleAuth}>
        {isSignup ? "Signup" : "Login"}
      </button>

      <br /><br />

      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? "Login" : "Signup"}
      </button>
    </div>
  );
}