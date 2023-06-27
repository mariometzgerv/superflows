import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../lib/database.types";
import { z } from "zod";
import { isValidBody } from "../../lib/utils";

if (process.env.SERVICE_LEVEL_KEY_SUPABASE === undefined) {
  throw new Error("SERVICE_LEVEL_KEY_SUPABASE is not defined!");
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined!");
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SERVICE_LEVEL_KEY_SUPABASE ?? ""
);

const CreateOrgZod = z.object({
  user_id: z.string(),
  org_name: z.string(),
});
type CreateOrgType = z.infer<typeof CreateOrgZod>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Only POST requests allowed",
    });
    return;
  }
  if (!isValidBody<CreateOrgType>(req.body, CreateOrgZod)) {
    res.status(400).send({ message: "Invalid request body" });
    return;
  }
  const { data, error } = await supabase
    .from("organizations")
    .insert({ name: req.body.org_name })
    .select();
  if (error) throw error;
  if (data === null)
    throw new Error("No data returned from organizations insert");
  const profileResp = await supabase
    .from("profiles")
    .update({ org_id: data[0].id })
    .eq("id", req.body.user_id)
    .select();
  if (profileResp.error) throw profileResp.error;
  if (profileResp.data === null)
    throw new Error("No data returned from profiles update");

  res.status(200).send({ success: true });
}