import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/users";
import {
  adicionaUser,
  getUsersAddComunidade,
  getComunidadeByNome,
  removeComunidadeuser,
} from "@/communities";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const FormSchema = z.object({
  nome: z.string(),
});

interface AddUserProps {
  comunidade: string;
}

export function AddUser({ comunidade }: AddUserProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { nome: "" },
  });

  const formRemove = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { nome: "" },
  });
  const user = useAuth();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users", comunidade],
    queryFn: async () => await getUsersAddComunidade(user.user!, comunidade),
    enabled: comunidade !== undefined,
  });

  const { data: remove, isLoading: isLoadingRemove } = useQuery({
    queryKey: ["usersRemove", comunidade],
    queryFn: () => getComunidadeByNome(comunidade),
    enabled: comunidade !== undefined,
  });
  const queryClient = useQueryClient();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    adicionaUser(comunidade, data);

    queryClient.invalidateQueries();

    form.reset();

    setOpen(false);
  }
  function onSubmitRemove(data: z.infer<typeof FormSchema>) {
    removeComunidadeuser(comunidade, data);

    queryClient.invalidateQueries();

    form.reset();

    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="bg-slate-500">
          <BsThreeDotsVertical />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="novoUser" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="novoUser">Adicioanr Usuário</TabsTrigger>
            <TabsTrigger value="removerUser">Remover Usuário</TabsTrigger>
          </TabsList>
          <TabsContent value="novoUser">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Usuário</CardTitle>
                <CardDescription>
                  Adicione um usuário a sua comunidade
                </CardDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuários</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um usuário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!isLoading &&
                                data?.map((user) => (
                                  <SelectItem value={user.nome} key={user.nome}>
                                    {user.nome}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Adcionar</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="removerUser">
            <Card>
              <CardHeader>
                <CardTitle>Remover Usuário</CardTitle>
                <CardDescription>
                  Remova um usuário de sua comunidade
                </CardDescription>
                <Form {...formRemove}>
                  <form
                    onSubmit={formRemove.handleSubmit(onSubmitRemove)}
                    className="w-2/3 space-y-6"
                  >
                    <FormField
                      control={formRemove.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuários</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um usuário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!isLoadingRemove &&
                                remove?.users.map((user) => (
                                  <SelectItem value={user.nome} key={user.nome}>
                                    {user.nome}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Remover</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
