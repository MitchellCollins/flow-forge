export type User = {
  id: number;
  email: string;
  password: string;
};

export type AuthError = { field: string; message: string };
export type AuthCallback = (error: AuthError) => void;

const MOCK_USERS: User[] = [
  {
    id: 1,
    email: "john.smith@gmail.com",
    password: "1234",
  },
];

export const authApi = {
  findByEmail: (email: string) => {
    return MOCK_USERS.find((MOCK_USER) => MOCK_USER.email === email);
  },

  signin: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject: AuthCallback) => {
      const user = authApi.findByEmail(email);
      if (!user) return reject({ field: "email", message: "No account with the provided email" });

      if (user.password !== password)
        return reject({ field: "password", message: "Incorrect Password" });

      resolve(user);
    });
  },

  register: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject: AuthCallback) => {
      const user = authApi.findByEmail(email);
      if (user) return reject({ field: "email", message: "Account with email already exists" });

      const newUser = { id: MOCK_USERS[MOCK_USERS.length - 1].id + 1, email, password };
      MOCK_USERS.push(newUser);

      resolve(newUser);
    });
  },
};
