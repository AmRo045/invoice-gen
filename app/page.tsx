"use client";

import { ReactToPrint } from "react-to-print";
import { ChangeEvent, useRef, useState } from "react";

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

interface InvoiceItem {
    pos: number;
    hours: number;
    unit: string;
    description: string;
    unitPrice: number;
    totalPrice: number;
}

interface Invoice {
    invoiceDate: Date;
    invoiceNo: number;
    total: number;
    subtotal: number;
    hasTax: boolean;
    taxAmount: number;
    hasHours: boolean;
    items: InvoiceItem[];
}

function InvoiceTableRow({ item, hasHours }: { item: InvoiceItem, hasHours: boolean }) {
    return <tr className="text-start">
        <td className="text-center px-1">{item.pos}</td>
        <td className={`text-center px-1 ${hasHours ? "" : "line-through print:hidden"}`}>{item.hours}</td>
        <td className="text-center min-w-[70px]">{item.unit}</td>
        <td className="text-[#0070c0] text-start min-w-[60px]">{item.description}</td>
        <td className="text-[#0070c0] text-end">{formatCurrency(item.unitPrice)}</td>
        <td className="text-[#0070c0] text-end pe-2">{formatCurrency(item.totalPrice)}</td>
    </tr>;
}

export default function Home() {
    const contentRef = useRef<HTMLElement | null>(null);

    const [data, setData] = useState<Invoice>({
        invoiceDate: new Date(2021, 11, 17),
        invoiceNo: 240005,
        total: 2975,
        subtotal: 2500,
        hasTax: true,
        taxAmount: 475,
        hasHours: true,
        items: [
            {
                pos: 1,
                hours: 50,
                unit: "Std.",
                description: "Installation services",
                unitPrice: 50,
                totalPrice: 2500
            }
        ]
    });

    const handleInvoiceNoChange = (e: ChangeEvent<HTMLDivElement>) => {
        const el = e.target as HTMLDivElement;
        setData({ ...data, ...{ invoiceNo: parseInt(el.innerText) } });
    };

    const handleTableColHoursToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const el = e.target as HTMLInputElement;
        setData({ ...data, ...{ hasHours: el.checked } });
    };

    const handleTaxToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const el = e.target as HTMLInputElement;
        setData({ ...data, ...{ hasTax: el.checked } });
    };

    return (
        <>
            <title>{data.invoiceNo}</title>
            <main className="bg-white text-black grid font-primary font-normal">
                <div className="sticky top-0 mb-5 flex justify-center w-full bg-gray-200 p-4">
                    <div className="flex gap-5 justify-between">
                        <button
                            className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+ Add
                        </button>

                        <ReactToPrint
                            trigger={() => <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print</button>}
                            content={() => contentRef.current}
                        />
                    </div>
                </div>
                <section className="w-a4 h-a4 mx-auto" id="container" ref={contentRef}>
                    <div className="w-[640px] m-auto">
                        <div className="flex justify-end  text-sm">
                            <div className="text-end">
                                <div>Datum : <span contentEditable={true}>{formatDate(data.invoiceDate)}</span></div>
                                <div className="flex gap-1">
                                    <span>Rechnungs-Nr.:</span>
                                    <div contentEditable={true}
                                         onInput={handleInvoiceNoChange}
                                         dangerouslySetInnerHTML={{
                                             __html: data.invoiceNo
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
                                    <th className={`text-center font-normal ${data.hasHours ? "" : "print:hidden"}`}>
                                        <div className="flex items-center">
                                            <input type="checkbox" onChange={handleTableColHoursToggle}
                                                   defaultChecked={data.hasHours} className="print:hidden" />
                                            <span className={data.hasHours ? "" : "line-through"}>Anzahl</span>
                                        </div>
                                    </th>
                                    <th className="text-center font-normal">Einheit</th>
                                    <th className="w-max text-start font-normal">Bezeichnung</th>
                                    <th className="w-max text-end font-normal">Einzelpreis</th>
                                    <th className="w-max text-end font-normal pe-2">Gesamtpreis</th>
                                </tr>
                                </thead>

                                <tbody>
                                {data.items.map((item) => <InvoiceTableRow item={item} hasHours={data.hasHours}
                                                                           key={item.pos} />)}
                                </tbody>
                            </table>

                            <div className="grid gap-3 mb-5 mt-[2.5rem]">
                                <div className="flex justify-between px-2">
                                    <span>Summe</span>
                                    <span className="text-[#0070c0]">{formatCurrency(data.subtotal)}</span>
                                </div>


                                <div className={`flex justify-between px-2 ${data.hasTax ? "" : "print:hidden"}`}>
                                    <div className="flex gap-1">
                                        <input type="checkbox" onChange={handleTaxToggle}
                                               defaultChecked={data.hasTax} className="print:hidden" />
                                        <span>Mehrwertsteuer 19% auf den Nettobedivag</span>
                                    </div>
                                    <span className="text-[#0070c0]">{formatCurrency(data.taxAmount)}</span>
                                </div>

                                <div className="bg-[#e7e6e6] flex justify-between px-2">
                                    <span className="">Gesamtbedivag</span>
                                    <span className="text-[#0070c0] font-bold">{formatCurrency(data.total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-1">
                            <div className="grid gap-5">
                                {!data.hasTax &&
                                    <div contentEditable={true}>Der Leistungsempfänger schuldet die Umsatzsteuer nach §
                                        13b UStG.</div>}

                                <div className="flex gap-1">
                                    <div contentEditable={true}>Der Rechnungsbetrag</div>
                                    <div>({formatCurrencyWithEurPostfix(data.total)})</div>
                                    <div contentEditable={true}>ist fällig bis zum</div>
                                    <div contentEditable={true}>{formatDate(data.invoiceDate)}.</div>
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
