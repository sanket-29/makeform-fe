import useApplicantHome from "@/screens/users/applicant-home/applicant-home.hook"
import { summaryData } from "@/screens/users/applicant-home/applicant-home.type"
import { useEffect } from "react"

const useSummary = () => {
    const { methods } = useApplicantHome()
    const { watch, setValue } = methods;
    const summaryBodyData = watch('myAppPageDetails.summaryBodyData') || []

    // Modify getCustomDescription to return the full object with button properties
    const getCustomDescription = (title: string, noOfData: number, balance: number): { description: string, isButtonDisable: boolean, onStatusClick: (() => void) | undefined ,status:string} => {
        let description = '';
        let isButtonDisable = false;
        let onStatusClick: (() => void) | undefined = undefined;
        let status=""

        switch (title) {
            case 'Review Applications':
            case "Review Apps":
                description = noOfData === 0
                    ? 'You have no applications to review'
                    : `You have ${noOfData} application${noOfData > 1 ? "s" : ""} to review`;
                status = "Review"; 
                isButtonDisable = noOfData === 0;
                break;
    
            case "Renew Applications":
            case "Renew Apps":
                description = noOfData === 0
                    ? 'You have no applications to review'
                    : `You have ${noOfData}  application${noOfData > 1 ? "s" : ""} to renew`;
                    status = "Renew"; 

                isButtonDisable = noOfData === 0;
                
                break;
            case "Pay Fees":
                description = noOfData === 0
                    ? 'You’re paid up for all applications'
                    : `You have a $${balance} balance for ${noOfData}  application${noOfData > 1 ? "s" : ""}`;
                    status="Pay"
                isButtonDisable = noOfData === 0;
                break;
            case "Inspections":
                description = noOfData === 0
                    ? 'You have no upcoming inspections'
                    : `You have ${noOfData} upcoming inspection${noOfData > 1 ? "s" : ""}`;
                    status="Schedule"
                isButtonDisable = noOfData === 0;

                break;
            case "Documents":
                description = noOfData === 0
                    ? "You have no outstanding documents to upload"
                    : `You have ${noOfData} outstanding document${noOfData > 1 ? "s" : ""} to upload`;
                    status="Review"
                isButtonDisable = noOfData === 0;
                break;
            case "Permits":
                description = noOfData === 0
                    ? "You have no permits generated"
                    : `You have ${noOfData} permit${noOfData > 1 ? "s" : ""} generated`;
                    status="Print"
                isButtonDisable = noOfData === 0;
                break;
            default:
                description = noOfData === 0 ? "No data" : `${noOfData} data`;
                isButtonDisable = noOfData === 0;
                break;
        }

        // Define onStatusClick based on whether the button is disabled
        if (!isButtonDisable) {
            onStatusClick = () => alert("Action triggered!"); // You can customize this based on your needs
        }

        return { description, isButtonDisable, onStatusClick ,status};
    }

    useEffect(() => {
        if (!Array.isArray(summaryBodyData)) return;
        summaryBodyData.forEach((item, index) => {
            // Get the description, isButtonDisable, and onStatusClick values directly from getCustomDescription
            const { description, isButtonDisable, onStatusClick,status } = getCustomDescription(
                item.title,
                item.noOfData,
                item.balance || 0
            );

            // Create the updated item with the new values
            const updatedItem: summaryData = {
                ...item,
                description,
                isButtonDisable,
                status,
                onStatusClick: onStatusClick ?? item.onStatusClick, // Ensure a valid onStatusClick function
            };
            // Only update the value if there is a change
            if (
                item.description !== updatedItem.description ||
                item.isButtonDisable !== updatedItem.isButtonDisable ||
                item.onStatusClick !== updatedItem.onStatusClick ||
                item.status !== updatedItem.status
            ) {
                setValue(
                    `myAppPageDetails.summaryBodyData.${index}`,
                    updatedItem,
                    {
                        shouldValidate: true,
                        shouldDirty: true,
                    }
                );
            }
        });
    }, [summaryBodyData, setValue]);

    return { summaryBodyData };
}

export default useSummary
