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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <body className="h-screen p-4">
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
              <Card>
                <CardHeader>
                  <CardTitle>Comece a utilizar a Community</CardTitle>
                  <CardDescription>
                    Crie uma conta gratuitamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="nome" placeholder="Nome" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Email" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="senha">Senha</Label>
                    <Input id="senha" placeholder="Senha" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                    <Input id="confirmarSenha" placeholder="Confirmar Senha" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Casdastre-se</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="entrar">
              <Card>
                <CardHeader>
                  <CardTitle>Acesse sua conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Email" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="senha">Senha</Label>
                    <Input id="senha" placeholder="Senha" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Entrat</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </body>
  );
}

export default Index;
