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

export interface Settlement {
    id: string;
    ticketId: string;
    expenseName: string;
    expenses: any[];
    status: string;
    totalAmount: number;
    submissionDate: string;
}

interface TicketContextType {
    tickets: Ticket[];
    addTicket: (ticket: Ticket) => void;
    settlements: Settlement[];
    addSettlement: (settlement: Settlement) => void;
}

export const TicketContext = createContext<TicketContextType>({
    tickets: [],
    addTicket: () => { },
    settlements: [],
    addSettlement: () => { },
});

export const TicketProvider = ({ children }: { children: ReactNode }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [settlements, setSettlements] = useState<Settlement[]>([]);

    const addTicket = (ticket: Ticket) => {
        setTickets((prev) => [...prev, ticket]);
    };

    const addSettlement = (settlement: Settlement) => {
        setSettlements((prev) => [...prev, settlement]);
    };

    return (
        <TicketContext.Provider value={{ tickets, addTicket, settlements, addSettlement }}>
            {children}
        </TicketContext.Provider>
    );
};
