import { UserLoginType, UserType } from "./lib/types";

export class PostNotFoundError extends Error {}

const users: UserType[] = [
  { id: "1", nome: "tamara", senha: "1234", email: "tamara@communitychat.com" },
];

export const fetchPost = async (postId: string) => {
  console.log(`Fetching post with id ${postId}...`);
  //   await new Promise((r) => setTimeout(r, 500));
  //   const post = await axios
  //     .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  //     .then((r) => r.data)
  //     .catch((err) => {
  //       if (err.response.status === 404) {
  //         throw new PostNotFoundError(`Post with id "${postId}" not found!`);
  //       }
  //       throw err;
  //     });

  //   return post;
};

export const cadastro = async (newUser: UserType) => {
  await new Promise((r) => setTimeout(r, 500));
  const usuarioExistente = users.find((user) => user.nome === newUser.nome);
  if (!usuarioExistente) {
    newUser.id = Math.random().toString();
    users.push(newUser);

    return true;
  } else {
    return false;
  }
};

export const logar = async (data: UserLoginType): Promise<UserLoginType | undefined> => {
  await new Promise((r) => setTimeout(r, 500));
  return users.find(user => user.email === data.email && user.senha === data.senha);
};
