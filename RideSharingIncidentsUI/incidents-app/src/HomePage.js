import React, { useState, useEffect } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TablePagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const API_URL = "https://localhost:44375/api/incidents";

const IncidentTable = () => {
    const [incidents, setIncidents] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [formData, setFormData] = useState({
        rideService: "",
        driverName: "",
        passengerName: "",
        incidentType: "",
        incidentDate: "",
        location: "",
        description: ""
    });

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const response = await axios.get(API_URL);
            setIncidents(response.data);
        } catch (error) {
            console.error("Error fetching incidents", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const handleOpen = (incident) => {
        setSelectedIncident(incident);
        setFormData(incident || {});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedIncident(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchIncidents();
        } catch (error) {
            console.error("Error deleting incident", error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (selectedIncident) {
                await axios.put(`${API_URL}/${selectedIncident.id}`, formData, {
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { "Content-Type": "application/json" },
                });
            }
            fetchIncidents();
            handleClose();
        } catch (error) {
            console.error("Error saving incident:", error.response ? error.response.data : error.message);
        }
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Ride-Sharing Incidents
            </Typography>
            <Toolbar>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by Ride Service"
                    value={search}
                    onChange={handleSearchChange}
                    sx={{ marginLeft: "auto" }}
                    InputProps={{
                        startAdornment: <SearchIcon />,
                    }}
                />
            </Toolbar>
            <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>
                Add New Incident
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ride Service</TableCell>
                            <TableCell>Driver</TableCell>
                            <TableCell>Passenger</TableCell>
                            <TableCell>Incident Type</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incidents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((incident) => (
                            <TableRow key={incident.id}>
                                <TableCell>{incident.rideService}</TableCell>
                                <TableCell>{incident.driverName}</TableCell>
                                <TableCell>{incident.passengerName}</TableCell>
                                <TableCell>{incident.incidentType}</TableCell>
                                <TableCell>{new Date(incident.incidentDate).toLocaleDateString()}</TableCell>
                                <TableCell>{incident.location}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(incident)}>Edit</Button>
                                    <Button color="error" onClick={() => handleDelete(incident.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={incidents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedIncident ? "Edit Incident" : "Add Incident"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Ride Service" name="rideService" value={formData.rideService} onChange={handleInputChange} />
                    <TextField fullWidth label="Driver Name" name="driverName" value={formData.driverName} onChange={handleInputChange} />
                    <TextField fullWidth label="Passenger Name" name="passengerName" value={formData.passengerName} onChange={handleInputChange} />
                    <TextField fullWidth label="Incident Type" name="incidentType" value={formData.incidentType} onChange={handleInputChange} />
                    <TextField fullWidth type="date" label="Incident Date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} />
                    <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} />
                    <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default IncidentTable;
