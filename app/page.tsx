export default function Home() {
    return (
        <main className="bg-white text-black flex justify-center font-primary font-normal">
            <section className="w-a4 h-a4" id="container">
                <div className="w-[640px] m-auto">
                    <div className="flex justify-end  text-sm">
                        <div className="text-end" contentEditable={true}>
                            <div>Datum : 15.03.2024</div>
                            <div>Rechnungs-Nr.: 240005</div>
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
                                <th className="text-center font-normal">Anzahl</th>
                                <th className="text-center font-normal">Einheit</th>
                                <th className="w-max text-start font-normal">Bezeichnung</th>
                                <th className="w-max text-end font-normal">Einzelpreis</th>
                                <th className="w-max text-end font-normal pe-2">Gesamtpreis</th>
                            </tr>
                            </thead>

                            <tbody>
                            <tr className="text-start">
                                <td className="text-center px-1">1</td>
                                <td className="text-center px-1">50</td>
                                <td className="text-center min-w-[70px]">Std.</td>
                                <td className="text-[#0070c0] text-start min-w-[60px]">Monteurleistung</td>
                                <td className="text-[#0070c0] text-end">50.00 €</td>
                                <td className="text-[#0070c0] text-end pe-2">2,500.00 €</td>
                            </tr>
                            </tbody>
                        </table>

                        <div className="grid gap-3 mb-5 mt-[2.5rem]">
                            <div className="flex justify-between px-2">
                                <span>Summe</span>
                                <span className="text-[#0070c0]" contentEditable={false}>2,500.00 €</span>
                            </div>

                            <div className="flex justify-between px-2">
                                <span>Mehrwertsteuer 19% auf den Nettobedivag</span>
                                <span className="text-[#0070c0]" contentEditable={false}>475.00 €</span>
                            </div>

                            <div className="bg-[#e7e6e6] flex justify-between px-2">
                                <span className="">Gesamtbedivag</span>
                                <span className="text-[#0070c0] font-bold" contentEditable={false}>2,975.00 €</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-1">
                        <div className="grid gap-5">
                            <div>Der Leistungsempfänger schuldet die Umsatzsteuer nach § 13b UStG.</div>
                            <div>Der Rechnungsbetrag (2,637.50 EUR) ist fällig bis zum 11.07.2024.</div>
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
    );
}
