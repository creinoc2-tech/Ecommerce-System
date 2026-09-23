import supabases from "../superbase/superbase";

interface IAuthLogin {
  email: string;
  password: string;
}

interface IAuthRegister extends IAuthLogin {
  fullName: string;
  phone: string;
}

export const signUp = async ({
  fullName,
  phone,
  email,
  password,
}: IAuthRegister) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabases.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) throw new Error(error.message);

  return { ...data, requiresEmailConfirmation: false };
};

export const signIn = async ({ email, password }: IAuthLogin) => {
  const { data, error } = await supabases.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error("Email o contraseña incorrecta");
  }

  return data;
};

export const signOut = async () => {
  try {
    const { error } = await supabases.auth.signOut();
    if (error) {
      console.log(error);
      throw new Error("Error al cerrar sesión");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSession = async () => {
  const { data, error } = await supabases.auth.getSession();
  if (error) {
    throw new Error("Error al obtener la sesión");
  }

  return data;
};

export const getUserData = async (userId: string) => {
  const { data, error } = await supabases
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Error al obtener los datos del usuario");
  }

  return data;
};

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabases
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Error al obtener el rol del usuario");
  }
  return data.role;
};


