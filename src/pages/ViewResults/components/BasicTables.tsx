import ComponentCard from "../../../components/common/ComponentCard";
import ElectionResultsTable from "./ElectionResultsTable";

interface Candidate {
  candidateId: string;
  name: string;
  party: string;
  votesSecured: number;
  percentage: number;
  status: string;
}

interface BasicTablesProps {
  candidates: Candidate[];
}

export default function BasicTables({ candidates }: BasicTablesProps) {
  return (
    <>
      <div className="mt-5 space-y-6">
        <ComponentCard title="Candidate Result">
          <ElectionResultsTable candidates={candidates} />
        </ComponentCard>
      </div>
    </>
  );
}
