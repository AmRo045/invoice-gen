import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { InvoiceItem } from "@/app/page";

interface Props {
    onAdd: (record: InvoiceItem) => void;
}

export default function AddModal({ onAdd }: Props) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<InvoiceItem>();

    const actualSubmit = (data: InvoiceItem) => {
        if (onAdd) {
            onAdd(data);
        }

        form.reset();
        dialogRef.current?.close();
        setIsOpen(false);
    };

    const openModal = () => {
        dialogRef.current?.showModal();
        setIsOpen(true);
    };

    useEffect(() => {
        const handleBackdropClick = (event: MouseEvent) => {
            if (dialogRef.current && event.target === dialogRef.current) {
                dialogRef.current?.close();
                form.reset();
                setIsOpen(false);
            }
        };

        const dialogElement = dialogRef.current;
        if (dialogElement) {
            dialogElement.addEventListener("click", handleBackdropClick);
        }

        return () => {
            if (dialogElement) {
                dialogElement.removeEventListener("click", handleBackdropClick);
            }
        };
    }, [form]);

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [form, isOpen]);

    return <>
        <button
            onClick={openModal}
            className="bg-black text-white rounded-lg font-bold py-2 px-4 hover:bg-gray-700 min-w-fit">+ Add
        </button>

        <dialog ref={dialogRef} className="rounded-lg">
            {isOpen && (
                <form className="p-3" onSubmit={form.handleSubmit(actualSubmit)}>
                    <h1>Add record</h1>
                    <hr className="mb-3 mt-2" />

                    <div className="my-2 flex justify-between items-center">
                        <span>Anzahl</span>
                        <input type="text" className="border-2 rounded-lg ms-2 p-1" {...form.register("hours", {
                            required: false,
                            setValueAs: (v) => parseFloat(v)
                        })} />

                    </div>

                    <div className="my-2 flex justify-between items-center">
                        <span>Einheit</span>
                        <input type="text" className="border-2 rounded-lg ms-2 p-1" {...form.register("unit", {
                            required: false
                        })} />
                    </div>

                    <div className="my-2 flex justify-between items-center">
                        <span>Bezeichnung</span>
                        <input type="text" className="border-2 rounded-lg ms-2 p-1" {...form.register("description", {
                            required: false
                        })} />
                    </div>

                    <div className="my-2 flex justify-between items-center">
                        <span>Einzelpreis</span>
                        <input type="text" className="border-2 rounded-lg ms-2 p-1" {...form.register("unitPrice", {
                            required: false,
                            setValueAs: (v) => parseFloat(v)
                        })} />
                    </div>

                    <hr className="my-3" />

                    <button
                        className="w-full bg-black text-white p-2 rounded-lg font-bold py-2 px-4 hover:bg-gray-700">Add
                    </button>
                </form>
            )}
        </dialog>
    </>;
}