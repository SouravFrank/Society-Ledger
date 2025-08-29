import EditorDashboard from "@/components/editor-dashboard";
import { getFinancialStatements, getMeetingMinutes } from "@/lib/db";

export default async function EditorPage() {
    const meetingMinutes = await getMeetingMinutes();
    const financialStatements = await getFinancialStatements();
    
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-4">Editor Dashboard</h1>
            <EditorDashboard 
                initialMeetingMinutes={meetingMinutes} 
                initialFinancialStatements={financialStatements}
            />
        </div>
    )
}
