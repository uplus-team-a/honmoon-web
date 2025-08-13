import { supabase } from "../lib/supabaseClient";
import type { ProfileResponse } from "./authService";

type SupaUser = {
  id: string;
  email?: string;
  app_metadata?: { provider?: string };
  user_metadata?: { name?: string; avatar_url?: string; picture?: string };
};

function mapToProfile(user: SupaUser | null): ProfileResponse | null {
  if (!user) return null;
  const provider = (user.app_metadata?.provider as string) || "password";
  const name =
    (user.user_metadata?.name as string) ||
    user.email?.split("@")[0] ||
    "사용자";
  const picture =
    (user.user_metadata?.avatar_url as string) ||
    (user.user_metadata?.picture as string) ||
    undefined;
  return {
    sub: user.id,
    email: user.email || undefined,
    name,
    picture,
    provider,
  };
}

export async function getCurrentProfile(): Promise<ProfileResponse | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return mapToProfile(data.user);
}

export async function loginWithGoogleOAuth(redirectTo?: string): Promise<void> {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}

export async function signInWithEmailPassword(params: {
  email: string;
  password: string;
}): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword(params);
  return !error;
}

export async function signUpWithEmailPassword(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: { data: { name: params.name } },
  });
  return !error && !!data.user;
}

export async function signOutSupabase(): Promise<void> {
  await supabase.auth.signOut();
}

// 회원 기본값 보정: users 테이블의 프로필 이미지 등 빈값 채우기
export async function ensureUserDefaults(defaults: {
  profile_image_url?: string;
}): Promise<void> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return;
  const userId = data.user.id;
  const { data: rows } = await supabase
    .from("users")
    .select("id, profile_image_url")
    .eq("id", userId)
    .maybeSingle();
  const needsUpdate = !rows || !rows.profile_image_url;
  if (needsUpdate && defaults.profile_image_url) {
    await supabase
      .from("users")
      .upsert(
        { id: userId, profile_image_url: defaults.profile_image_url },
        { onConflict: "id" }
      );
  }
}
