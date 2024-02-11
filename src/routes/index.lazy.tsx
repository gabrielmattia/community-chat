import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cadastro, logar } from "@/users";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const EntarSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});
const CadastroSchema = z
  .object({
    id: z.string().optional(),
    nome: z.string().min(2, {
      message: "Nome deve conter pelo menos 2 caracteres.",
    }),
    email: z.string().email(),
    senha: z
      .string()
      .min(4, { message: "Senha deve conter pelo menos 4 caracteres" }),
    confirmarSenha: z
      .string()
      .min(4, { message: "Senha deve conter pelo menos 4 caracteres" }),
  })
  .refine((data) => data.senha == data.confirmarSenha, {
    message: "Senhas não são iguais",
    path: ["confirmarSenha"],
  });

function Index() {
  const navigate = useNavigate();

  const cadastroForm = useForm<z.infer<typeof CadastroSchema>>({
    resolver: zodResolver(CadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const entarForm = useForm<z.infer<typeof EntarSchema>>({
    resolver: zodResolver(EntarSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  function onSubmit(data: z.infer<typeof CadastroSchema>) {
    cadastro(data).then((res) => {
      if (res) {
        navigate({ to: "/about" });
      } else {
        cadastroForm.setError("email", { message: "Email já cadastrado" });
      }
    });
  }

  function entrar(data: z.infer<typeof EntarSchema>) {
    logar(data).then((res) => {
      if (res) {
        navigate({ to: "/about" });
      } else {
        entarForm.setError("email", { message: "Email ou senha invalido" });
        entarForm.setError("senha", { message: "Email ou senha invalido" });
      }
    });
  }

  return (
    <div className="h-screen p-4">
      <header>
        <p className="text-3xl font-bold p-2 pl-10">COMMUNITY CHAT</p>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[93%]">
        <section className="sm:mb-0 flex items-center ">
          <div className="grid gap-10 pl-10">
            <h1 className="scroll-m-10 text-4xl font-extrabold tracking-tight lg:text-1xl">
              Você também pode fazer parte da COMMUNITY
            </h1>
            <h2 className=" scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ">
              Inicie um diálogo, construa comunidades e troque experiências!
            </h2>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <Tabs defaultValue="cadastro" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cadastro">Cadastre-se</TabsTrigger>
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
            </TabsList>
            <TabsContent value="cadastro">
              <Form {...cadastroForm}>
                <form onSubmit={cadastroForm.handleSubmit(onSubmit)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Comece a utilizar a Community</CardTitle>
                      <CardDescription>
                        Crie uma conta gratuitamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={cadastroForm.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={cadastroForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={cadastroForm.control}
                          name="senha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Senha"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={cadastroForm.control}
                          name="confirmarSenha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confrimar Senha</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confrimar Senha"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Cadastre-se</Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="entrar">
              <Form {...entarForm}>
                <form onSubmit={entarForm.handleSubmit(entrar)}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Acesse sua conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={entarForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={entarForm.control}
                          name="senha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Senha"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Cadastre-se</Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}

export default Index;
