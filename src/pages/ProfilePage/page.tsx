import { useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import ProfileTabs from "./components/ProfileTabs";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import { FormField, Input, Textarea } from "@/components/shared/FormField";
import { ErrorState } from "@/components/shared/StateViews";

import { useProfile, useUpdateProfile } from "@/hooks";
import { TOAST_MESSAGES } from "@/constants";
import { UpdateProfileRequest } from "@/types";

// ── Profile info row ─────────────────────────────────────────
function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-neutral-100 last:border-0">
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-900 text-right max-w-[60%] break-words">
        {value || "-"}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<UpdateProfileRequest>({});

  const { data, isLoading, isError, refetch } = useProfile();
  const profile = data?.data;

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  function openEdit() {
    setForm({
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      bio: profile?.bio ?? "",
    });
    setEditOpen(true);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile(form, {
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.PROFILE_UPDATE_SUCCESS);
        setEditOpen(false);
      },
      onError: () => toast.error(TOAST_MESSAGES.PROFILE_UPDATE_ERROR),
    });
  }

  return (
    <MainLayout showSearch={false}>
      <div className="page-container py-6 md:py-10 flex flex-col gap-6">

        {/* Tabs */}
        <ProfileTabs />

        {/* Heading */}
        <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>

        {/* Error */}
        {isError && <ErrorState onRetry={refetch} />}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="border border-neutral-200 rounded-2xl p-5 flex flex-col gap-4 animate-pulse max-w-lg">
            <div className="w-16 h-16 rounded-full bg-neutral-200" />
            <div className="flex flex-col gap-3 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-neutral-100">
                  <div className="h-3 w-24 bg-neutral-200 rounded-full" />
                  <div className="h-3 w-32 bg-neutral-200 rounded-full" />
                </div>
              ))}
            </div>
            <div className="h-11 rounded-full bg-neutral-200 mt-2" />
          </div>
        )}

        {/* Profile card */}
        {!isLoading && !isError && profile && (
          <div className="border border-neutral-200 rounded-2xl p-5 flex flex-col gap-1 max-w-lg bg-white">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden mb-3">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-neutral-400" />
              )}
            </div>

            {/* Info rows */}
            <ProfileRow label="Name" value={profile.name} />
            <ProfileRow label="Email" value={profile.email} />
            <ProfileRow label="Nomor Handphone" value={profile.phone} />
            {profile.bio && (
              <ProfileRow label="Bio" value={profile.bio} />
            )}

            {/* Update button */}
            <Button className="w-full mt-4" onClick={openEdit}>
              Update Profile
            </Button>
          </div>
        )}
      </div>

      {/* ── Edit Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Update Profile"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Name">
            <Input
              name="name"
              value={form.name ?? ""}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
            />
          </FormField>

          <FormField label="Nomor Handphone">
            <Input
              name="phone"
              type="tel"
              value={form.phone ?? ""}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
            />
          </FormField>

          <FormField label="Bio (opsional)">
            <Textarea
              name="bio"
              value={form.bio ?? ""}
              onChange={handleChange}
              placeholder="Ceritakan sedikit tentang dirimu..."
              rows={3}
            />
          </FormField>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setEditOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1" isLoading={isPending}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}