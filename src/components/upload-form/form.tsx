"use client"

import {useForm} from "react-hook-form";
import * as z from "zod"

import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Loader} from "lucide-react";
import {useMessageStore} from "~/components/upload-form/store";
import {readZipFile} from "~/lib/beanconqueror/file-utils";
import {buildPrompt} from "~/lib/beans/prompts";
import {useRouter} from "next/navigation";
import {ChangeEvent, useState} from "react";

/**
 * Schema used in the beanconqueror form
 */
export const formSchema = z.object({
  file: z.string()
});

/**
 * Submit button which uses the useFormStatus hook to display the form status
 */
function SubmitButton() {
  const pending = useMessageStore(state => state.pending);
  return (
    <Button type={"submit"} variant={"secondary"} aria-disabled={pending} disabled={pending}>
      {pending ? "Uploading" : "Upload"}
      {pending && <Loader className={"animate-spin h-4 w-4 ml-2"}/>}
    </Button>
  );
}

/**
 * Onboarding form which asks the user for a zip file and an OpenAI key
 */
export default function UploadForm() {
  const [file, setFile] = useState<File>();
  const setPending = useMessageStore(state => state.setPending);
  const updateMessages = useMessageStore(state => state.updateMessages);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: "",
    }
  });

  const submit = async () => {
    if (!file) {
      return;
    }

    setPending(true);
    const zipContents = await readZipFile(file);
    const initialPrompt = buildPrompt(zipContents);
    updateMessages(...initialPrompt);
    setPending(false);
    router.push("/chat");
  }

  return (
    <Form {...form}>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name={"file"}
          render={({field}) => (
            <FormItem>
              <FormLabel>Beanconqueror file</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type={"file"}
                  accept={"application/zip"}
                  multiple={false}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setFile(event.target.files?.[0]);
                    field.onChange(event);
                  }}
                  className={"text-foreground"}/>
              </FormControl>
              <FormDescription className={"text-muted/50"}>
                Provide a Beanconqueror zip file, this will be used to provide data to the AI.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <SubmitButton/>
      </form>
    </Form>
  )
}