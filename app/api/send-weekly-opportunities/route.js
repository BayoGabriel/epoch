import { format } from 'date-fns';

export async function POST(req) {
    try {
        const { weekStart, weekEnd, opportunities, types } = await req.json();

        // Format the email content
        const emailContent = `
            <h1>New Opportunities for ${format(new Date(weekStart), 'MMMM d')} - ${format(new Date(weekEnd), 'MMMM d, yyyy')}</h1>
            <p>We have ${opportunities.length} new opportunities in ${types.join(', ')}!</p>
            
            ${types.map(type => `
                <h2>${type} Opportunities</h2>
                ${opportunities
                    .filter(opp => opp.type === type)
                    .map(opp => `
                        <div style="margin-bottom: 20px;">
                            <h3>${opp.position} at ${opp.institution}</h3>
                            <p>Application Deadline: ${format(new Date(opp.applicationDeadline), 'MMMM do, yyyy')}</p>
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/prospecta/${opp._id}">View Details</a>
                        </div>
                    `).join('')}
            `).join('')}
        `;

        // Send email using sender.net API
        const response = await fetch('https://api.sender.net/v2/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SENDER_API_KEY}`,
            },
            body: JSON.stringify({
                template_id: process.env.SENDER_TEMPLATE_ID, // You'll need to create a template in sender.net
                variables: {
                    content: emailContent,
                },
                subscribers: 'all' // This will send to all subscribers
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error sending weekly opportunities email:', error);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
