import React, { createContext, useState, ReactNode } from 'react';

export interface Ticket {
    id: string;
    from: string;
    to: string;
    date: string;
    purpose: string;
    costCode: string;
    tripType: string;
}

interface TicketContextType {
    tickets: Ticket[];
    addTicket: (ticket: Ticket) => void;
}

export const TicketContext = createContext<TicketContextType>({
    tickets: [],
    addTicket: () => { },
});

export const TicketProvider = ({ children }: { children: ReactNode }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const addTicket = (ticket: Ticket) => {
        setTickets((prev) => [...prev, ticket]);
    };

    return (
        <TicketContext.Provider value={{ tickets, addTicket }}>
            {children}
        </TicketContext.Provider>
    );
};
