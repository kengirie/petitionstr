import { NDKUser } from '@nostr-dev-kit/ndk';

import { Spinner } from '@/shared/components/spinner';

import {
  ProfileActions,
  ProfileAvatar,
  ProfileBanner,
  ProfileEditor,
  ProfileNotes,
  ProfileReactions,
  ProfileSummary,
  ProfileViewSwitcher,
} from './components';

import { ProfilePetitions } from './components/profile-petitions';

import { useUserProfileWidget } from './hooks';

export const UserProfileWidget = ({
  user,
  initialEditMode = false,
}: {
  user: NDKUser;
  initialEditMode?: boolean;
}) => {
  const { profile, view, setView, editMode, setEditMode } = useUserProfileWidget({
    user,
    initialEditMode,
  });

  if (profile === undefined) {
    return <Spinner />;
  }

  return (
    <>
      <div className="relative">
        {editMode ? (
          <>
            <ProfileEditor setEditMode={setEditMode} initialProfile={profile} />
          </>
        ) : (
          <>
            <ProfileBanner banner={profile?.banner} />

            <ProfileAvatar image={profile?.image} />

            <ProfileActions targetUser={user} setEditMode={setEditMode} />

            <ProfileSummary user={user} profile={profile} />

            <ProfileViewSwitcher view={view} setView={setView} />

            <div className="p-2">
                {view == 'petitions' && <ProfilePetitions user={user} />}
              {view == 'notes' && <ProfileNotes user={user} notesOnly />}
              {view == 'reactions' && <ProfileReactions user={user} />}
            </div>
          </>
        )}
      </div>
    </>
  );
};
