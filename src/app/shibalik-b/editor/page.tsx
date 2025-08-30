'use client';
import EditorDashboard from "@/components/editor-dashboard";
import { financialStatements, meetingMinutes } from "@/data";

export default function EditorPage() {
    const sortedMinutes = [...meetingMinutes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const sortedStatements = [...financialStatements].sort((a,b) => new Date(b.period + '-01').getTime() - new Date(a.period + '-01').getTime());
    
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-4">Editor Dashboard</h1>
            <EditorDashboard 
                initialMeetingMinutes={sortedMinutes} 
                initialFinancialStatements={sortedStatements}
            />
        </div>
    )
}
