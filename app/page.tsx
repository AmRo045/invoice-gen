"use client";

import { ReactToPrint } from "react-to-print";
import { ChangeEvent, useRef, useState } from "react";
import Modal from "@/app/components/modal";

const taxRate = 19;

const formatCurrency = (number) => {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
    }).format(number);
};

const formatCurrencyWithEurPostfix = (number) => {
    return formatCurrency(number).replace("€", "EUR");
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat("de-DE").format(date);
};

export interface InvoiceItem {
    pos: number;
    hours: number;
    unit: string;
    description: string;
    unitPrice: number;
}

interface Invoice {
    invoiceDate: Date;
    invoiceNo: number;
    total: number;
    hasTax: boolean;
    taxAmount: number;
    hasHours: boolean;
}

function InvoiceTableRow({ item, hasHours }: { item: InvoiceItem, hasHours: boolean }) {
    return <tr className="text-start">
        <td className="text-center px-1">{item.pos}</td>
        <td className={`text-center px-1 ${hasHours ? "" : "line-through print:hidden"}`}>{item.hours}</td>
        <td className="text-center min-w-[70px]">{item.unit}</td>
        <td className="text-[#0070c0] text-start min-w-[60px]">{item.description}</td>
        <td className="text-[#0070c0] text-end">{formatCurrency(item.unitPrice)}</td>
        <td className="text-[#0070c0] text-end pe-2">{formatCurrency(hasHours ? item.unitPrice * item.unitPrice : item.unitPrice)}</td>
    </tr>;
}

export default function Home() {
    const contentRef = useRef<HTMLElement | null>(null);

    const [invoice, setInvoice] = useState<Invoice>({
        invoiceDate: new Date(2021, 11, 17),
        invoiceNo: 240005,
        total: 2975,
        subtotal: 2500,
        hasTax: true,
        taxAmount: 475,
        hasHours: true
    });

    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
        {
            pos: 1,
            hours: 50,
            unit: "Std.",
            description: "Installation services",
            unitPrice: 50
        }
    ]);

    const updateSummary = (inv, items) => {
        inv.total = items.reduce((prev, cur) => {
            return prev + (inv.hasHours ? cur.unitPrice * cur.hours : cur.unitPrice);
        }, 0);

        if (inv.hasTax) {
            inv.taxAmount = inv.total * (taxRate / 100);
        } else {
            inv.taxAmount = 0;
        }
    };

    const handleInvoiceNoChange = (e: ChangeEvent<HTMLDivElement>) => {
        const el = e.target as HTMLDivElement;
        setInvoice({ ...invoice, ...{ invoiceNo: parseInt(el.innerText) } });
    };

    const handleTableColHoursToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const el = e.target as HTMLInputElement;
        invoice.hasHours = el.checked;

        updateSummary(invoice, invoiceItems);
        setInvoice({ ...invoice });
    };

    const handleTaxToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const el = e.target as HTMLInputElement;
        invoice.hasTax = el.checked;

        updateSummary(invoice, invoiceItems);
        setInvoice({ ...invoice });
    };

    const handleAdd = (record: InvoiceItem) => {
        const newInvoiceItems = [...invoiceItems, {
            pos: record.pos,
            hours: record.hours,
            unit: record.unit,
            description: record.description,
            unitPrice: record.unitPrice
        }];

        updateSummary(invoice, newInvoiceItems);

        setInvoice({ ...invoice });
        setInvoiceItems(newInvoiceItems);
    };

    return (
        <>
            <title>{invoice.invoiceNo}</title>
            <main className="bg-white text-black grid font-primary font-normal">
                <div className="sticky top-0 mb-5 flex justify-center w-full bg-gray-200 p-4 print:hidden">
                    <div className="flex gap-5 justify-between items-center">
                        <div>
                            <label className="flex gap-1 items-center">
                                <input type="checkbox" onChange={handleTableColHoursToggle}
                                       defaultChecked={invoice.hasHours} />
                                Hours
                            </label>

                            <label className="flex gap-1 items-center">
                                <input type="checkbox" onChange={handleTaxToggle}
                                       defaultChecked={invoice.hasTax} />
                                Tax
                            </label>
                        </div>

                        <Modal onAdd={handleAdd} newPos={invoiceItems.length + 1} />

                        <ReactToPrint
                            trigger={() => <button
                                className="w-full bg-blue-500 text-white p-2 rounded-lg font-bold py-2 px-4 hover:bg-blue-700">Print</button>}
                            content={() => contentRef.current}
                        />
                    </div>
                </div>
                <section className="w-a4 h-a4 mx-auto py-4" id="container" ref={contentRef}>
                    <div className="w-[640px] m-auto">
                        <div className="flex justify-end text-sm">
                            <div className="text-end">
                                <div>Datum : <span contentEditable={true}>{formatDate(invoice.invoiceDate)}</span></div>
                                <div className="flex gap-1">
                                    <span>Rechnungs-Nr.:</span>
                                    <div contentEditable={true}
                                         onInput={handleInvoiceNoChange}
                                         dangerouslySetInnerHTML={{
                                             __html: invoice.invoiceNo
                                         }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[8rem]" contentEditable={true}>
                            <div>Firma Berg GMBH</div>
                            <div>HEIZUNG-KLIMA</div>
                            <div>SANITÄR KLEMPNER</div>
                            <div>Ostfeld 15</div>
                            <div>21635 Jork</div>
                        </div>

                        <div className="my-5">
                            <strong className="font-semibold text-xl">Rechnung</strong>
                        </div>

                        <div className="mb-4" contentEditable={true}>
                            <div>Sehr geehrte Damen und Herren,</div>
                            <div>ich danke Ihnen für die Beauftragung. Wie vereinbart</div>
                            <div>erhalten Sie die Rechnung für meine Leistung von 07.03.2024 bis 15.03.2024.</div>
                        </div>

                        <div>
                            <table className="w-full">
                                <thead>
                                <tr className="bg-[#e7e6e6] text-left px-2">
                                    <th className="text-center px-1 font-normal">Pos.</th>
                                    <th className={`text-center font-normal ${invoice.hasHours ? "" : "print:hidden"}`}>
                                        <span className={invoice.hasHours ? "" : "line-through"}>Anzahl</span>
                                    </th>
                                    <th className="text-center font-normal">Einheit</th>
                                    <th className="w-max text-start font-normal">Bezeichnung</th>
                                    <th className="w-max text-end font-normal">Einzelpreis</th>
                                    <th className="w-max text-end font-normal pe-2">Gesamtpreis</th>
                                </tr>
                                </thead>

                                <tbody>
                                {invoiceItems.map((item) => <InvoiceTableRow item={item} hasHours={invoice.hasHours}
                                                                             key={item.pos} />)}
                                </tbody>
                            </table>

                            <div className="grid gap-3 mb-5 mt-[2.5rem]">
                                <div className="flex justify-between px-2">
                                    <span>Summe</span>
                                    <span className="text-[#0070c0]">{formatCurrency(invoice.total)}</span>
                                </div>


                                {invoice.hasTax && (
                                    <div
                                        className={`flex justify-between px-2 ${invoice.hasTax ? "" : "print:hidden"}`}>
                                        <span>Mehrwertsteuer 19% auf den Nettobedivag</span>
                                        <span className="text-[#0070c0]">{formatCurrency(invoice.taxAmount)}</span>
                                    </div>
                                )}

                                <div className="bg-[#e7e6e6] flex justify-between px-2">
                                    <span className="">Gesamtbedivag</span>
                                    <span
                                        className="text-[#0070c0] font-bold">{formatCurrency(invoice.total + invoice.taxAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-1">
                            <div className="grid gap-5">
                                {!invoice.hasTax &&
                                    <div contentEditable={true}>Der Leistungsempfänger schuldet die Umsatzsteuer nach §
                                        13b UStG.</div>}

                                <div className="flex gap-1">
                                    <div contentEditable={true}>Der Rechnungsbetrag</div>
                                    <div>({formatCurrencyWithEurPostfix(invoice.total + invoice.taxAmount)})</div>
                                    <div contentEditable={true}>ist fällig bis zum</div>
                                    <div contentEditable={true}>{formatDate(invoice.invoiceDate)}.</div>
                                </div>
                                <div>
                                    <div>Mit freundlichen Grüßen.</div>
                                    <div>Alireza Divdar</div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-[40px] text-sm" contentEditable={true}>
                                <div>Bankverbindung:</div>
                                <div>Steuernummer: 43/109/02528</div>
                            </div>

                            <div className="text-sm">
                                <div contentEditable={true}>Sparkasse Stade-Altes Land</div>
                                <div contentEditable={true}>BAN: DE69 2415 1005 1210 4192 20</div>
                                <div contentEditable={true}>BIC: NOLADE21STS</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
