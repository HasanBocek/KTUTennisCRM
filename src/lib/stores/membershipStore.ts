import { writable, derived } from 'svelte/store';
import type { MembershipType } from '$lib/types/types';
import { MembershipData } from '$lib/assets/data/mock/data';

// Ana membership store
export const membershipStore = writable<MembershipType[]>([...MembershipData]);

// Pending ve payment pending durumundaki üyelikler için derived store
export const pendingMemberships = derived(
  membershipStore,
  ($memberships) => $memberships.filter(
    membership => membership.status === "approvementPending" || membership.status === "paymentPending"
  )
  
);

// Aktif üyelikler için derived store
export const activeMemberships = derived(
  membershipStore,
  ($memberships) => $memberships.filter(
    membership => membership.status === "active"
  )
);

// Membership store actions
export const membershipActions = {
  // Membership status güncelleme
  updateMembershipStatus: (membershipId: string, newStatus: string) => {
    membershipStore.update(memberships => 
      memberships.map(membership => 
        membership._id === membershipId 
          ? { ...membership, status: newStatus }
          : membership
      )
    );
  },

  // Membership onaylama (approvementPending -> paymentPending veya paymentPending -> active)
  approveMembership: (membershipId: string) => {
    membershipStore.update(memberships => 
      memberships.map(membership => {
        if (membership._id === membershipId) {
          if (membership.status === "approvementPending") {
            return { ...membership, status: "paymentPending" };
          } else if (membership.status === "paymentPending") {
            return { ...membership, status: "active" };
          }
        }
        return membership;
      })
    );
  },

  // Membership reddetme
  rejectMembership: (membershipId: string) => {
    membershipStore.update(memberships => 
      memberships.map(membership => 
        membership._id === membershipId 
          ? { ...membership, status: "rejected" }
          : membership
      )
    );
  },

  // Yeni membership ekleme
  addMembership: (membership: MembershipType) => {
    membershipStore.update(memberships => [...memberships, membership]);
  },

  // Membership silme
  removeMembership: (membershipId: string) => {
    membershipStore.update(memberships => 
      memberships.filter(membership => membership._id !== membershipId)
    );
  },

  // Store'u sıfırlama (mock data ile)
  resetStore: () => {
    membershipStore.set([...MembershipData]);
  }
};