"use client";

import { ReactToPrint } from "react-to-print";
import { ChangeEvent, FormEvent, SVGProps, useRef, useState } from "react";
import AddModal from "@/app/components/add-modal";
import EditModal from "@/app/components/edit-modal";

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
    hours: number;
    unit: string;
    description: string;
    unitPrice: number;
}

interface Invoice {
    invoiceDate: Date;
    invoiceNo: string;
    total: number;
    hasTax: boolean;
    taxAmount: number;
    hasHours: boolean;
}


function DeleteIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
        </svg>
    );
}

function InvoiceTableRow({ index, item, hasHours, onDelete, onEdit }: {
    index: number;
    item: InvoiceItem;
    hasHours: boolean;
    onDelete: (index: number) => void;
    onEdit: (index: number, item: InvoiceItem) => void;
}) {
    return <tr className="text-start">
        <td className="text-center px-1 print:hidden relative py-4">
            <div className="flex gap-1 items-center absolute left-[-3.8rem] top-0">
                <button onClick={() => onDelete(index)}
                        className="bg-gray-300 text-gray-600 rounded-lg font-bold p-1 mt-1 hover:bg-gray-400 min-w-fit">
                    <DeleteIcon />
                </button>

                <EditModal index={index} data={item} onSubmit={onEdit} />
            </div>
        </td>
        <td className="text-center px-1">{index + 1}</td>
        <td className={`text-center px-1 ${hasHours ? "" : "line-through print:hidden"}`}>{item.hours}</td>
        <td className="text-center min-w-[70px]">{item.unit}</td>
        <td className="text-[#0070c0] text-start min-w-[60px]">{item.description}</td>
        <td className="text-[#0070c0] text-end">{formatCurrency(item.unitPrice)}</td>
        <td className="text-[#0070c0] text-end pe-2">{formatCurrency(hasHours ? item.unitPrice * item.hours : item.unitPrice)}</td>
    </tr>;
}

export default function Home() {
    const contentRef = useRef<HTMLElement | null>(null);

    const [invoice, setInvoice] = useState<Invoice>({
        invoiceDate: new Date(2021, 11, 17),
        invoiceNo: "240005",
        total: 2975,
        hasTax: true,
        taxAmount: 475,
        hasHours: true
    });

    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
        {
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

    const handleInvoiceNoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const el = e.target as HTMLInputElement;
        setInvoice({ ...invoice, invoiceNo: el.value });
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
            hours: record.hours,
            unit: record.unit,
            description: record.description,
            unitPrice: record.unitPrice
        }];

        updateSummary(invoice, newInvoiceItems);

        setInvoice({ ...invoice });
        setInvoiceItems(newInvoiceItems);
    };

    const handleEdit = (index: number, item: InvoiceItem) => {
        const newInvoiceItems = [...invoiceItems];
        newInvoiceItems[index] = item;

        updateSummary(invoice, newInvoiceItems);

        setInvoice({ ...invoice });
        setInvoiceItems(newInvoiceItems);
    };

    const handleDelete = (index: number) => {
        if (confirm("Are you sure?")) {
            const newInvoiceItems = [...invoiceItems];
            newInvoiceItems.splice(index, 1);

            updateSummary(invoice, newInvoiceItems);

            setInvoice({ ...invoice });
            setInvoiceItems(newInvoiceItems);
        }
    };

    const adjustInputWidth = (e: FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const span = document.getElementById("hidden-span") as HTMLSpanElement;

        if (span) {
            span.innerText = input.value || " ";
            input.style.width = `${span.offsetWidth}px`;
        }
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

                        <AddModal onAdd={handleAdd} />

                        <ReactToPrint
                            trigger={() => <button
                                className="w-full bg-blue-500 text-white p-2 rounded-lg font-bold py-2 px-4 hover:bg-blue-700">Print</button>}
                            content={() => contentRef.current}
                        />
                    </div>
                </div>
                <section className="w-a4 h-a4 mx-auto pt-[20px]" id="container" ref={contentRef}>
                    <div className="w-[640px] m-auto">
                        <div className="flex justify-end text-sm">
                            <div className="text-end">
                                <div>Datum : <span contentEditable={true}
                                                   suppressContentEditableWarning={true}>{formatDate(invoice.invoiceDate)}</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span>Rechnungs-Nr.:</span>
                                    <div className="inline-flex items-center">
                                        <span id="hidden-span" className="invisible absolute whitespace-pre"></span>
                                        <input type="text"
                                               className="w-[47px]"
                                               defaultValue={invoice.invoiceNo}
                                               onInput={handleInvoiceNoChange}
                                               onInputCapture={adjustInputWidth} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[6.6rem]" contentEditable={true} suppressContentEditableWarning={true}>
                            <div>Firma Berg GMBH</div>
                            <div>HEIZUNG-KLIMA</div>
                            <div>SANITÄR KLEMPNER</div>
                            <div>Ostfeld 15</div>
                            <div>21635 Jork</div>
                        </div>

                        <div className="my-5">
                            <strong className="font-semibold text-xl">Rechnung</strong>
                        </div>

                        <div className="mb-4" contentEditable={true} suppressContentEditableWarning={true}>
                            <div>Sehr geehrte Damen und Herren,</div>
                            <div>ich danke Ihnen für die Beauftragung. Wie vereinbart</div>
                            <div>erhalten Sie die Rechnung für meine Leistung von 07.03.2024 bis 15.03.2024.</div>
                        </div>

                        <div>
                            <table className="w-full">
                                <thead>
                                <tr className="bg-[#e7e6e6] text-left px-2">
                                    <th className="text-center px-1 font-normal print:hidden"></th>
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
                                {invoiceItems.map((item, index) => <InvoiceTableRow
                                    item={item} hasHours={invoice.hasHours}
                                    index={index}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    key={index} />)}
                                </tbody>
                            </table>

                            <div className="grid gap-3 mb-5 mt-[2rem]">

                                {invoiceItems.length > 0 && (
                                    <>
                                        <div className="flex justify-between px-2">
                                            <span>Summe</span>
                                            <span className="text-[#0070c0]">{formatCurrency(invoice.total)}</span>
                                        </div>


                                        {invoice.hasTax && (
                                            <div
                                                className={`flex justify-between px-2 ${invoice.hasTax ? "" : "print:hidden"}`}>
                                                <span>Mehrwertsteuer 19% auf den Nettobedivag</span>
                                                <span
                                                    className="text-[#0070c0]">{formatCurrency(invoice.taxAmount)}</span>
                                            </div>
                                        )}

                                        <div className="bg-[#e7e6e6] flex justify-between px-2">
                                            <span className="">Gesamtbedivag</span>
                                            <span
                                                className="text-[#0070c0] font-bold">{formatCurrency(invoice.total + invoice.taxAmount)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="px-1">
                            <div className="grid gap-3">
                                {!invoice.hasTax &&
                                    <div contentEditable={true} suppressContentEditableWarning={true}>Der
                                        Leistungsempfänger schuldet die Umsatzsteuer nach §
                                        13b UStG.</div>}

                                <div className="flex gap-1">
                                    <div contentEditable={true} suppressContentEditableWarning={true}>Der
                                        Rechnungsbetrag
                                    </div>
                                    <div>({formatCurrencyWithEurPostfix(invoice.total + invoice.taxAmount)})</div>
                                    <div contentEditable={true} suppressContentEditableWarning={true}>ist fällig bis
                                        zum
                                    </div>
                                    <div contentEditable={true}
                                         suppressContentEditableWarning={true}>{formatDate(invoice.invoiceDate)}.
                                    </div>
                                </div>
                                <div>
                                    <div>Mit freundlichen Grüßen.</div>
                                    <div>Alireza Divdar</div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-[30px] text-sm" contentEditable={true}
                                 suppressContentEditableWarning={true}>
                                <div>Bankverbindung:</div>
                                <div>Steuernummer: 43/109/02528</div>
                            </div>

                            <div className="text-sm">
                                <div contentEditable={true} suppressContentEditableWarning={true}>Sparkasse Stade-Altes
                                    Land
                                </div>
                                <div contentEditable={true} suppressContentEditableWarning={true}>BAN: DE69 2415 1005
                                    1210 4192 20
                                </div>
                                <div contentEditable={true} suppressContentEditableWarning={true}>BIC: NOLADE21STS</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
