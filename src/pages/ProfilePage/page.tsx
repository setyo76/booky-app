import { useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import { FormField, Input, Textarea } from "@/components/shared/FormField";
import { ErrorState } from "@/components/shared/StateViews";
import ReviewsTab from "@/pages/ProfilePage/components/ReviewsTab";
import BorrowedListTab from "@/pages/ProfilePage/components/BorrowedListTab";

import { useProfile, useUpdateProfile } from "@/hooks";
import { TOAST_MESSAGES } from "@/constants";
import { UpdateProfileRequest } from "@/types";

type TabId = "profile" | "borrowed" | "reviews";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "borrowed", label: "Borrowed List" },
  { id: "reviews", label: "Reviews" },
];

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

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabId) || "profile";

  const handleTabChange = (id: TabId) => {
    setSearchParams({ tab: id });
  };

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<UpdateProfileRequest>({});

  const { data, isLoading, isError, refetch } = useProfile();
  const profile = data;

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  function openEdit() {
    setForm({
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      bio: profile?.bio ?? "",
    });
    setEditOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

        {/* Tab Navigation */}
        <div className="flex items-center bg-neutral-100 rounded-xl p-1 gap-1 w-full md:w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Profile */}
        {activeTab === "profile" && (
          <>
            <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>

            {isError && <ErrorState onRetry={refetch} />}

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

            {!isLoading && !isError && profile && (
              <div className="border border-neutral-200 rounded-2xl p-5 flex flex-col gap-1 max-w-lg bg-white">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                    {profile.profilePhoto ? (
                      <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 uppercase tracking-widest">
                    {(profile as { role?: string }).role ?? 'USER'}
                  </span>
                </div>

                <ProfileRow label="Name" value={profile.name} />
                <ProfileRow label="Email" value={profile.email} />
                <ProfileRow label="Nomor Handphone" value={profile.phone} />
                {profile.bio && <ProfileRow label="Bio" value={profile.bio} />}

                <Button className="w-full mt-4" onClick={openEdit}>
                  Update Profile
                </Button>
              </div>
            )}
          </>
        )}

        {/* Tab: Borrowed List ✅ */}
        {activeTab === "borrowed" && (
          <>
            <h1 className="text-2xl font-bold text-neutral-900">Borrowed List</h1>
            <BorrowedListTab />
          </>
        )}

        {/* Tab: Reviews */}
        {activeTab === "reviews" && <ReviewsTab />}

      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Update Profile" size="sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Name">
            <Input name="name" value={form.name ?? ""} onChange={handleChange} placeholder="Enter full name" />
          </FormField>
          <FormField label="Phone Number">
            <Input name="phone" type="tel" value={form.phone ?? ""} onChange={handleChange} placeholder="Example: 081234567890" />
          </FormField>
          <FormField label="Bio (optional)">
            <Textarea name="bio" value={form.bio ?? ""} onChange={handleChange} placeholder="Tell us a little about yourself..." rows={3} />
          </FormField>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}