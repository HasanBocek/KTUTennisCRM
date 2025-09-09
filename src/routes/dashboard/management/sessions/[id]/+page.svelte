<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import type { MeType } from "$lib/types/types";
  export let data: { user: MeType };
  import {
    Col,
    Row,
    TabContent,
    TabPane,
  } from "@sveltestrap/sveltestrap";
  import { SessionData, UserData } from "$lib/assets/data/mock/data";
  import type { SessionType } from "$lib/types/types";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import SessionInfoCard from "./components/SessionInfoCard.svelte";
  import AttendanceTable from "./components/AttendanceTable.svelte";
  // End session modal removed
  import SessionNotFound from "./components/SessionNotFound.svelte";
  import SessionInfo from "./components/SessionInfo.svelte";
  import SessionDetailsCard from "./components/SessionDetailsCard.svelte";
  const sessionId = $page.params.id;
  let sessionData: SessionType | null =
    SessionData.find((s) => s._id === sessionId) || null;
  let editedAttendance = sessionData?.attendance
    ? [...sessionData.attendance]
    : [];
  let editedNotes: string = sessionData?.notes || "";

  // Non-null view model used inside the {#if sessionData}{:else} block
  let sessionForView: SessionType =
    sessionData as SessionType;
  let isUpdating = false,
    success = "",
    error = "";

  // Formatting, status text, and table rendering moved to components

  function updateAttendance(
    userIndex: number,
    newStatus: string
  ) {
    editedAttendance[userIndex] = {
      ...editedAttendance[userIndex],
      status: newStatus,
    };
  }

  function updateAttendanceNote(userIndex: number, note: string) {
    editedAttendance[userIndex] = {
      ...editedAttendance[userIndex],
      note: note,
    };
  }

  function updateDetails(payload: {
    coaches: string[];
    status: string;
    startTime: Date;
    endTime?: Date;
    notes: string;
  }) {
    if (!sessionData) return;
    isUpdating = true;
    // Apply changes immediately for instant UI reflection
    sessionData!.status = payload.status as string;
    sessionData!.startTime = payload.startTime;
    sessionData!.endTime = payload.endTime as Date;
    sessionData!.notes = payload.notes;
    
    // Create a map from both current session coaches and all UserData
    const currentCoachesById = new Map(
      (sessionData!.coaches || []).map((c) => [c._id, c])
    );
    const allUsersById = new Map(
      UserData.map((u) => [u._id, u])
    );
    
    sessionData!.coaches = payload.coaches.map((id) => {
      // First try to find in current coaches, then in all users
      const coach = currentCoachesById.get(id) || allUsersById.get(id);
      return coach || { _id: id, firstName: "Koç", lastName: "Koç", phoneNumber: "" };
    });
    
    editedNotes = payload.notes;
    // Mark the view model as dirty so children get updated props
    sessionForView = sessionData as SessionType;

    // Simulate server latency before clearing the updating state
    setTimeout(() => {
      isUpdating = false;
      success = "Detaylar güncellendi";
    }, 800);
  }

  // End session flow removed

  function handleBackToSessions() {
    goto("/dashboard/management/sessions");
  }
  $: presentCount = editedAttendance.filter(
    (a) => a.status === "present"
  ).length;
  $: lateCount = editedAttendance.filter(
    (a) => a.status === "late"
  ).length;
  $: excusedCount = editedAttendance.filter(
    (a) => a.status === "excused"
  ).length;
  $: absentCount = editedAttendance.filter(
    (a) => a.status === "absent"
  ).length;
</script>

<DefaultLayout user={data.user}>
  {#if !sessionData}
    <Row>
      <Col>
        <SessionNotFound onBack={handleBackToSessions} />
      </Col>
    </Row>
  {:else}
    <Row>
      <Col>
        <SessionInfo
          session={sessionForView}
          {presentCount}
          {lateCount}
          {excusedCount}
          {absentCount}
        />
      </Col>
    </Row>
    <Row>
      <Col lg={4}>
        <SessionInfoCard sessionData={sessionForView} />
      </Col>

      <Col lg={8}>
        <TabContent class="mb-3">
          <TabPane
            active
            tabId="attendance"
            tab="Yoklama"
            class="pt-3"
          >
            <AttendanceTable
              session={sessionData}
              {editedAttendance}
              {updateAttendance}
              {updateAttendanceNote}
            />
          </TabPane>
          <TabPane tabId="details" tab="Detaylar" class="pt-3">
            <SessionDetailsCard
              session={sessionForView}
              {isUpdating}
              onUpdate={updateDetails}
            />
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  {/if}

  <!-- End session modal removed -->
</DefaultLayout>
