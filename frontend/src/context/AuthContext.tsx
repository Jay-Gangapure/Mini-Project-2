import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type Language = "en" | "hi" | "mr";

interface UserType {
  name: string;
  email: string;
  preferred_language: Language;
}

interface AuthContextType {
  token: string | null;
  user: UserType | null;

  language: Language;

  setLanguage: (lang: Language) => void;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  signup: (
    name: string,
    email: string,
    password: string,
    language: Language
  ) => Promise<boolean>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,

  language: "en",

  setLanguage: () => {},

  login: async () => false,

  signup: async () => false,

  logout: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  // TOKEN
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // USER
  const [user, setUser] = useState<UserType | null>(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // LANGUAGE
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem("language") as Language) || "en"
  );

  const setLanguage = (lang: Language) => {

    setLanguageState(lang);

    localStorage.setItem(
      "language",
      lang
    );
  };

  // LOGIN
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {

    try {

      console.log("LOGIN STARTED");

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      console.log(
        "LOGIN RESPONSE STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "LOGIN RESPONSE DATA:",
        data
      );

      const receivedToken =
        data?.data?.access_token;

      const receivedUser =
        data?.data?.user;

      if (receivedToken && receivedUser) {

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          receivedToken
        );

        setToken(receivedToken);

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(receivedUser)
        );

        setUser(receivedUser);

        console.log(
          "TOKEN SAVED SUCCESSFULLY:",
          receivedToken
        );

        console.log(
          "USER SAVED SUCCESSFULLY:",
          receivedUser
        );

        return true;
      }

      console.log("TOKEN OR USER NOT FOUND");

      return false;

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      return false;
    }
  };

  // SIGNUP
  const signup = async (
    name: string,
    email: string,
    password: string,
    language: Language
  ): Promise<boolean> => {

    try {

      console.log("SIGNUP STARTED");

      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            preferred_language: language,
          }),
        }
      );

      console.log(
        "SIGNUP RESPONSE STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "SIGNUP RESPONSE DATA:",
        data
      );

      const receivedToken =
        data?.data?.access_token;

      const receivedUser =
        data?.data?.user;

      if (receivedToken && receivedUser) {

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          receivedToken
        );

        setToken(receivedToken);

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(receivedUser)
        );

        setUser(receivedUser);

        console.log(
          "TOKEN SAVED SUCCESSFULLY:",
          receivedToken
        );

        console.log(
          "USER SAVED SUCCESSFULLY:",
          receivedUser
        );

        return true;
      }

      console.log(
        "SIGNUP COMPLETED - TOKEN OR USER NOT RETURNED"
      );

      return false;

    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      return false;
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,

        language,

        setLanguage,

        login,

        signup,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);