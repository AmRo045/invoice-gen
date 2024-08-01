import { SVGProps, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { InvoiceItem } from "@/app/page";

interface Props {
    index: number;
    data: InvoiceItem;
    onSubmit: (index: number, item: InvoiceItem) => void;
}

function EditIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path fill="currentColor"
                  d="M10 14v-2.615l8.944-8.944q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345L12.52 14zm9.466-8.354l1.347-1.361l-1.111-1.17l-1.387 1.381zM5.615 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h8.386l-6.386 6.387v5.998h5.896L20 9.895v8.489q0 .69-.462 1.153T18.384 20z"></path>
        </svg>
    );
}

export default function EditModal({ index, data, onSubmit }: Props) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<InvoiceItem>({
        defaultValues: data
    });

    const actualSubmit = (data: InvoiceItem) => {
        if (onSubmit) {
            onSubmit(index, data);
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

        form.reset(data);
    }, [form, isOpen, data]);

    return <>
        <button onClick={openModal}
                className="bg-gray-300 text-gray-600 rounded-lg font-bold p-1 mt-1 hover:bg-gray-400 min-w-fit">
            <EditIcon />
        </button>

        <dialog ref={dialogRef} className="rounded-lg">
            {isOpen && (
                <form className="p-3" onSubmit={form.handleSubmit(actualSubmit)}>
                    <h1>Edit record</h1>
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
                        className="w-full bg-black text-white p-2 rounded-lg font-bold py-2 px-4 hover:bg-gray-700">Save
                    </button>
                </form>
            )}
        </dialog>
    </>;
}