import { useState, useEffect, Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconUserPlus from '../components/Icon/IconUserPlus';
import IconSearch from '../components/Icon/IconSearch';
import IconX from '../components/Icon/IconX';

const API_URL = 'https://localhost:44375/api/incidents'; // API Endpoint

// Define Type for Incidents
interface Incident {
    id: number;
    createdOn: string;
    location: string;
    incidentType: string;
    incidentDate: string;
    rideService: string;
    driverName: string;
    description: string;
    passengerName: string;
}

const Incidents = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(setPageTitle('Incidents Management'));
        fetchIncidents(); // Fetch data on component mount 
    }, []);

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [search, setSearch] = useState('');
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addEditModal, setAddEditModal] = useState(false);
    

    // Fetch incidents from API
    const fetchIncidents = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch incidents');
            const data: Incident[] = await response.json();
            setIncidents(data);
        } catch (error) {
            console.error('Error fetching incidents:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not fetch incidents',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false
            });
        }
    };

    // Open modal with incident details
    const viewIncident = (incident: Incident) => {
        setSelectedIncident(incident);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedIncident(null);
    };

    // Filter incidents based on search input
    const filteredIncidents = incidents.filter((incident) =>
        incident.incidentType.toLowerCase().includes(search.toLowerCase())
    );

    const [incidentForm, setIncidentForm] = useState<Partial<Incident>>({
        location: "",
        incidentType: "",
        incidentDate: "",
        rideService: "",
        driverName: "",
        passengerName: "",
        description: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setIncidentForm((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIncidentForm((prev) => ({
            ...prev,
            incidentDate: e.target.value, // Only the date part, no time
        }));
    };

    const deleteIncident = async (incidentId: number) => {
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });
    
        if (confirmation.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/${incidentId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
    
                if (!response.ok) throw new Error("Failed to delete incident");
    
                // Swal.fire("Deleted!", "Incident has been deleted.", "success");
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: 'Incident has been deleted.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false
                });
                fetchIncidents(); // Refresh the list after deletion
            } catch (error) {
                console.error("Error deleting incident:", error);
                // Swal.fire("Error", "Could not delete incident", "error");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not delete incident',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    allowOutsideClick: false
                });
            }
        }
    };

    const closeAddEditModal = () => {
        setAddEditModal(false);
        setIncidentForm({
            location: "",
            incidentType: "",
            incidentDate: "",
            rideService: "",
            driverName: "",
            passengerName: "",
            description: "",
        });
        setSelectedIncident(null);
    };

    const editIncident = (incident: Incident) => {
        setIncidentForm({
            ...incident,
            // Convert ISO date to 'YYYY-MM-DDTHH:MM' format required by datetime-local input
            incidentDate: incident.incidentDate 
                ? new Date(incident.incidentDate).toISOString().slice(0, 16) 
                : '',
        });
        setAddEditModal(true);
    };

    const saveIncident = async () => {
        const isUpdate = !!incidentForm.id; // Check if it's an update
        const method = isUpdate ? "PUT" : "POST";
        const url = isUpdate ? `${API_URL}/${incidentForm.id}` : API_URL;
    
        const body = {
            id: isUpdate ? incidentForm.id : undefined, // Include ID only for updates
            rideService: incidentForm.rideService,
            driverName: incidentForm.driverName,
            passengerName: incidentForm.passengerName,
            incidentType: incidentForm.incidentType,
            incidentDate: incidentForm.incidentDate 
                ? new Date(incidentForm.incidentDate).toISOString() 
                : new Date().toISOString(),  // Ensure ISO format
            location: incidentForm.location,
            description: incidentForm.description,
        };
    
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    
            if (!response.ok) throw new Error("Failed to save incident");
    
            // Swal.fire("Success", `Incident ${isUpdate ? "updated" : "added"} successfully`, "success");
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Incident ${isUpdate ? "updated" : "added"} successfully`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false
            });
            setAddEditModal(false);
            setIncidentForm({ // Reset form fields
                location: "",
                incidentType: "",
                incidentDate: "",
                rideService: "",
                driverName: "",
                passengerName: "",
                description: "",
            });
            fetchIncidents();
        } catch (error) {
            console.error("Error saving incident:", error);
            Swal.fire("Error", "Could not save incident", "error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Incidents Report</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <button type="button" className="btn btn-primary"  onClick={() => setAddEditModal(true)}>
                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                        Add Incident
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Incidents"
                            className="form-input py-2 peer"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="button" className="absolute top-1/2 right-4 -translate-y-1/2">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Created On</th>
                                <th>Location</th>
                                <th>Incident Type</th>
                                <th>Company</th>
                                <th>Driver</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
    {filteredIncidents.length > 0 ? (
        filteredIncidents.map((incident) => (
            <tr key={incident.id}>
                <td>{new Date(incident.createdOn).toLocaleDateString()}</td>
                <td>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incident.location)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        {incident.location}
                    </a>
                </td>
                <td>{incident.incidentType}</td>
                <td>{incident.rideService}</td>
                <td>{incident.driverName}</td>
                <td>
                    <div className="flex gap-4 items-center justify-center">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-info"
                            onClick={() => viewIncident(incident)}
                        >
                            View
                        </button>
                        <button 
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editIncident(incident)}
                        >
                            Edit
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteIncident(incident.id)}
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={6} className="text-center">No Incidents Found</td>
        </tr>
    )}
</tbody>
                    </table>
                </div>
            </div>

            {/* View Modal with SlideIn Down Animation */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" open={isModalOpen} onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex items-start justify-center min-h-screen px-4">
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                            <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                <h5 className="font-bold text-lg">Incident Details</h5>
                                <button onClick={closeModal} className="text-white-dark hover:text-dark">
                                    <IconX />
                                </button>
                            </div>
                            <div className="p-5">
                                {selectedIncident && (
                                    <div>
                                    <h5 className="font-bold text-lg">Incident Details</h5> 
                                    <pre className="whitespace-pre-wrap text-sm mt-2">
                                        Incident NO: {selectedIncident.id}, Created on: {new Date(selectedIncident.createdOn).toLocaleDateString()}<br/>
                                        {selectedIncident.description || "No description provided"} occurred at {selectedIncident.location}.<br/>
                                        Driver Name: {selectedIncident.driverName} from {selectedIncident.rideService}<br/>
                                        is being reported for {new Date(selectedIncident.incidentDate).toLocaleDateString()}<br/>
                                        by Passenger: {selectedIncident.passengerName || "Unknown Passenger"}
                                    </pre>
                                </div>
                                )}
                                <div className="flex justify-end items-center mt-8">
                                    <button onClick={closeModal} type="button" className="btn btn-outline-danger">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={addEditModal} as={Fragment}>
                <Dialog as="div" open={addEditModal} onClose={closeAddEditModal} className="relative z-[51]">
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={closeAddEditModal}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {incidentForm.id ? 'Edit Contact' : 'Add Contact'}
                                    </div>
                                    <div className="p-5">
                                    <form>
    <div className="mb-5">
        <label htmlFor="rideService">Ride Service</label>
        <input id="rideService" type="text" placeholder="Enter Ride Service" className="form-input" value={incidentForm.rideService} onChange={handleInputChange} />
    </div>
    <div className="mb-5">
        <label htmlFor="driverName">Driver Name</label>
        <input id="driverName" type="text" placeholder="Enter Driver Name" className="form-input" value={incidentForm.driverName} onChange={handleInputChange} />
    </div>
    <div className="mb-5">
        <label htmlFor="passengerName">Passenger Name</label>
        <input id="passengerName" type="text" placeholder="Enter Passenger Name" className="form-input" value={incidentForm.passengerName} onChange={handleInputChange} />
    </div>
    <div className="mb-5">
        <label htmlFor="incidentType">Incident Type</label>
        <input id="incidentType" type="text" placeholder="Enter Incident Type" className="form-input" value={incidentForm.incidentType} onChange={handleInputChange} />
    </div>
    <div className="mb-5">
    <label htmlFor="incidentDate">Incident Date</label>
    <input
        id="incidentDate"
        type="date"  // Change from datetime-local to date
        className="form-input"
        value={incidentForm.incidentDate ? incidentForm.incidentDate.split('T')[0] : ''} // Extract only the date part
        onChange={handleDateChange}
    />
</div>
    <div className="mb-5">
        <label htmlFor="location">Location</label>
        <input id="location" type="text" placeholder="Enter Location" className="form-input" value={incidentForm.location} onChange={handleInputChange} />
    </div>
    <div className="mb-5">
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={3} placeholder="Enter Description" className="form-textarea resize-none min-h-[100px]" value={incidentForm.description} onChange={handleInputChange}></textarea>
    </div>
    <div className="flex justify-end items-center mt-8">
        <button type="button" className="btn btn-outline-danger" onClick={closeAddEditModal}>Cancel</button>
        <button type="button" className="btn btn-primary ml-4" onClick={saveIncident}>
            {incidentForm.id ? 'Update' : 'Add'}
        </button>
    </div>
</form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Incidents;
