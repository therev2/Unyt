"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUserProfile } from "@/components/useUserProfile";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface CollegePollVoteProps {
  poll: any;
  collegeId: string;
  onVoted?: () => void;
}

export default function CollegePollVote({ poll, collegeId, onVoted }: CollegePollVoteProps) {
  const { userData } = useUserProfile();
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(() => !!(poll.voters && userData?.uid && poll.voters[userData.uid]));

  // Always check if voted before rendering options
  const userId = userData?.uid;
  const hasVoted = !!(poll.voters && userId && poll.voters[userId]);
  const votedOptionId = hasVoted && userId ? poll.voters[userId] : null;

  const handleVote = async () => {
    if (selected == null || !userData?.uid) return;
    setLoading(true);
    try {
      const optionIdx = poll.options.findIndex((o: PollOption) => o.id === selected);
      if (optionIdx === -1) throw new Error("Invalid option");
      const voterKey = `voters.${userData.uid}`;
      const pollRef = doc(db, `Colleges/${collegeId}/Polls/${poll.id}`);
      // Update the entire options array to preserve all fields
      const newOptions = poll.options.map((opt: PollOption, idx: number) =>
        idx === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt
      );
      await updateDoc(pollRef, {
        options: newOptions,
        totalVotes: (poll.totalVotes || 0) + 1,
        [voterKey]: selected,
      });
      setVoted(true);
      if (onVoted) onVoted();
    } catch (e) {
      alert("Error voting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (hasVoted && userId && votedOptionId != null) {
    return (
      <div className="space-y-2">
        {poll.options.map((option: PollOption) => {
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          return (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox checked={option.id === votedOptionId} disabled />
              <div className="w-full">
                <div className="flex justify-between">
                  <span>{option.text}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>
          );
        })}
        <Button className="w-full" disabled>You have already voted</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {poll.options.map((option: PollOption) => {
        const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
        return (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              checked={selected === option.id}
              onCheckedChange={() => setSelected(option.id)}
              disabled={loading}
            />
            <div className="w-full">
              <div className="flex justify-between">
                <span>{option.text}</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          </div>
        );
      })}
      <Button className="w-full" onClick={handleVote} disabled={selected == null || loading}>
        Vote Now
      </Button>
    </div>
  );
}
