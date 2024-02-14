import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaUserPlus } from "react-icons/fa6";
import { Switch } from "./ui/switch";
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
} from "./ui/form";
import {
  criarComunidade,
  entarComunidade,
  procurarComunidade,
} from "@/communities";
import { useAuth } from "@/users";
import { CommunityType } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ComunidadeSchema = z.object({
  nome: z.string().min(1, { message: "Nome obrigatório" }),
  descricao: z.string(),
  criador: z.string(),
  privada: z.boolean().default(false),
});

const FormSchema = z.object({
  comunidade: z.string(),
});

export function CreateCommunityDialog() {
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["procurarComunidades"],
    queryFn: () => procurarComunidade(user.user!)
    ,
  });

  const comunidadeForm = useForm<z.infer<typeof ComunidadeSchema>>({
    resolver: zodResolver(ComunidadeSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      criador: user.user!,
    },
  });
  const queryClient = useQueryClient();

  function onSubmit(data: z.infer<typeof ComunidadeSchema>) {
    const newComunidade: CommunityType = {
      id: Math.random().toString(),
      criador: data.criador,
      privada: data.privada,
      nome: data.nome,
      descricao: data.descricao,
      users: [],
    };
    criarComunidade(newComunidade);
 
    comunidadeForm.reset();
    queryClient.invalidateQueries();

    setOpen(false);
  }

  const entar = useMutation({
    mutationFn: entarComunidade,
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { comunidade: "" },
  });

  async function onSubmitProcurar(data: z.infer<typeof FormSchema>) {
    
    const value = { comunidade: data.comunidade, nome: user.user! };
    entar.mutate(value, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["procurarComunidades"] });
        queryClient.invalidateQueries({ queryKey: ["comunidades"] });
        queryClient.invalidateQueries();


      },
    });

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FaUserPlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="novaComunidade" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="novaComunidade">Nova Comunidade</TabsTrigger>
            <TabsTrigger value="procuraComunidades">
              Procurar Comunidades
            </TabsTrigger>
          </TabsList>
          <TabsContent value="novaComunidade">
            <Card>
              <CardHeader>
                <CardTitle>Nova Community</CardTitle>
                <CardDescription>Crie uma nova comunidade</CardDescription>
                <Form {...comunidadeForm}>
                  <form onSubmit={comunidadeForm.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <FormField
                          control={comunidadeForm.control}
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
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <FormField
                          control={comunidadeForm.control}
                          name="descricao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Input placeholder="Descrição" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <FormField
                          control={comunidadeForm.control}
                          name="privada"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-end gap-4 rounded-lg border p-4">
                              <FormLabel className="text-base">
                                Privada
                              </FormLabel>

                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Criar</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="procuraComunidades">
            <CardHeader>
              <CardTitle>Procurar Comunidades</CardTitle>
              <CardDescription>
                Procure e entre em uma comunidade
              </CardDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitProcurar)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="comunidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comunidades</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma comunidade " />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!isLoading &&
                              data?.map((comunidade) => (
                                <SelectItem
                                  value={comunidade.nome}
                                  key={comunidade.id}
                                >
                                  {comunidade.nome}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Entrar</Button>
                </form>
              </Form>
            </CardHeader>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


