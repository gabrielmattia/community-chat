import { CommunityType } from "./lib/types";
import { getUsers } from "./users";

interface User {
  nome: string;
  id?: string;
}

export const criarComunidade = async (data: CommunityType) => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const comunidadeExistente = communities.find(
    (comunidade: CommunityType) => comunidade.nome === data.nome
  );

  if (!comunidadeExistente) {
    communities.push(data);

    const communitiesString = JSON.stringify(communities);
    localStorage.setItem("communities", communitiesString);
    return true;
  } else {
    return false;
  }
};

export const getComunidades = async (
  nome: string
): Promise<CommunityType[]> => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const criador = communities.filter(
    (objeto: CommunityType) => objeto.criador === nome
  );

  const participante = communities.filter((objeto: CommunityType) =>
    objeto.users.some((user) => user.nome === nome)
  );

  participante.forEach((part: User) => criador.push(part));
  return criador;
};

export const procurarComunidade = async (
  nome: string
): Promise<CommunityType[] | null> => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  return communities.filter((comunidade: CommunityType) => {
    const temMesmoNome = comunidade.users.some((user) => user.nome === nome);
    return !comunidade.privada && comunidade.criador !== nome && !temMesmoNome;
  });
};

export const entarComunidade = async (value: {
  comunidade: string;
  nome: string;
}) => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const comunidadeEncontrada = communities.find(
    (comunidade: CommunityType) => comunidade.nome === value.comunidade
  );

  if (comunidadeEncontrada) {
    const newUser = { nome: value.nome };
    comunidadeEncontrada.users.push(newUser);
    const communitiesString = JSON.stringify(communities);
    localStorage.setItem("communities", communitiesString);
  }
};

export const getComunidadeByNome = async (
  nome: string
): Promise<CommunityType> => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const comunidadeEncontrada = communities.find(
    (comunidade: CommunityType) => comunidade.nome === nome
  );

  return comunidadeEncontrada!;
};

export const adicionaUser = async (
  nomeComunidade: string,
  user: { nome: string }
) => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const comunidadeEncontrada = communities.find(
    (comunidade: CommunityType) => comunidade.nome === nomeComunidade
  );
  comunidadeEncontrada?.users.push(user);
  const comunidadeEncontradaString = JSON.stringify(communities);
  localStorage.setItem("communities", comunidadeEncontradaString);
};

export const removeComunidadeuser = async (
  nomeComunidade: string,
  user: { nome: string }
) => {
  await new Promise((r) => setTimeout(r, 500));
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const comunidadeEncontrada = communities.find(
    (comunidade: CommunityType) => comunidade.nome === nomeComunidade
  )!;

  const index = comunidadeEncontrada.users.findIndex(
    (elemento: User) => elemento.nome === user.nome
  );
  if (index !== -1) {
    comunidadeEncontrada.users.splice(index, 1);
    const comunidadeEncontradaString = JSON.stringify(comunidadeEncontrada);
    localStorage.setItem("communities", comunidadeEncontradaString);
  }
};

export const getUsersAddComunidade = async (
  nome: string,
  comunidadeNome: string
) => {
  const communitiesString = localStorage.getItem("communities");
  const communities = JSON.parse(communitiesString as string);

  const comunidadeEncontrada = communities.find(
    (comunidade:CommunityType) => comunidade.nome === comunidadeNome
  )!;

  const users = await getUsers(nome);

  const a = users;
  const b = comunidadeEncontrada.users;

  const isSameUser = (a: User, b: User): boolean => a.nome === b.nome;

  const onlyInLeft = (
    left: User[],
    right: User[],
    compareFunction: (a: User, b: User) => boolean
  ): User[] =>
    left.filter(
      (leftValue: User) =>
        !right.some((rightValue: User) =>
          compareFunction(leftValue, rightValue)
        )
    );

  const onlyInA = onlyInLeft(a, b, isSameUser);

  const onlyInB = onlyInLeft(b, a, isSameUser);

  const result = [...onlyInA, ...onlyInB];

  return result;
};
