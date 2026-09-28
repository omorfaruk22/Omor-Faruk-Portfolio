export type AvailabilityId = "available" | "freelancer" | "collaboration" | "unavailable";

export const availabilityOptions: { id: AvailabilityId; label: string; code: string; color: string }[] = [
  { id: "available", label: "Available", code: "available_for_work", color: "#22C55E" },
  { id: "freelancer", label: "Freelancer", code: "open_for_freelance", color: "#22C55E" },
  { id: "collaboration", label: "Open to Collaboration", code: "open_to_collab", color: "#EAB308" },
  { id: "unavailable", label: "Currently Unavailable", code: "unavailable", color: "#6B7280" },
];

// Change this ONE value to update the status in Navbar, Hero, About and Contact.
export const availability = { status: "available" as AvailabilityId };
