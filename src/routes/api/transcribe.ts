import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = auth.slice(7);

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!supabaseUrl || !supabaseKey) {
          return new Response("Missing Supabase env", { status: 500 });
        }
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const sup = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: c, error } = await sup.auth.getClaims(token);
        if (error || !c?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return new Response("Expected multipart/form-data", { status: 400 });
        }
        const file = form.get("file");
        if (!(file instanceof Blob)) {
          return new Response("Missing audio file", { status: 400 });
        }
        if (file.size < 2048) {
          return new Response("Audio too short or empty", { status: 400 });
        }
        if (file.size > 20 * 1024 * 1024) {
          return new Response("Audio too large", { status: 413 });
        }

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, "recording.wav");
        upstream.append("language", "pt");

        const res = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}` },
            body: upstream,
          },
        );

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          return new Response(t || "Transcription failed", { status: res.status });
        }

        const json = (await res.json().catch(() => ({}))) as { text?: string };
        return Response.json({ text: json.text ?? "" });
      },
    },
  },
});