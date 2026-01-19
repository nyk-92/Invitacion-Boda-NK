import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
    const [confirmaciones, setConfirmaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'asistira', 'no_asistira'

    useEffect(() => {
        const q = query(collection(db, 'confirmaciones'), orderBy('timestamp', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConfirmaciones(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la confirmación de "${nombre}"?`)) {
            try {
                await deleteDoc(doc(db, 'confirmaciones', id));
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Hubo un error al intentar eliminar el registro.");
            }
        }
    };

    const filtradas = confirmaciones.filter(c => {
        if (filter === 'all') return true;
        return c.estado === filter;
    });

    const totalAsistira = confirmaciones.filter(c => c.estado === 'asistira').length;
    const totalAcompanantes = confirmaciones
        .filter(c => c.estado === 'asistira')
        .reduce((sum, c) => sum + (c.acompanantes || 0), 0);
    const totalNoAsistira = confirmaciones.filter(c => c.estado === 'no_asistira').length;

    const descargarExcel = () => {
        const headers = ['Nombre', 'Estado', 'Acompañantes', 'Fecha'];
        const rows = filtradas.map(c => {
            let fechaStr = 'N/A';
            if (c.timestamp) {
                try {
                     const fecha = c.timestamp.toDate ? c.timestamp.toDate() : new Date(c.timestamp);
                     fechaStr = fecha.toLocaleDateString();
                } catch (e) { console.error(e); }
            }
            return [
                c.nombre,
                c.estado === 'asistira' ? 'Asistirá' : 'No asistirá',
                c.acompanantes || 0,
                fechaStr
            ];
        });

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        link.download = 'confirmaciones_boda.csv';
        link.click();
    };

    if (loading) {
        return <div className="dashboard" style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>;
    }

    return (
        <div className="dashboard">
            <h1>📊 Dashboard de Confirmaciones</h1>
            
            {/* Estadísticas */}
            <div className="stats">
                <div className="stat-card total">
                    <h3>Total Confirmaciones</h3>
                    <p className="stat-number">{confirmaciones.length}</p>
                </div>
                <div className="stat-card asistira">
                    <h3>Asistirá</h3>
                    <p className="stat-number">{totalAsistira}</p>
                    <p className="stat-detail">+ {totalAcompanantes} acompañantes</p>
                </div>
                <div className="stat-card no-asistira">
                    <h3>No Asistirá</h3>
                    <p className="stat-number">{totalNoAsistira}</p>
                </div>
            </div>

            {/* Filtros y descargas */}
            <div className="controls">
                <div className="filter-buttons">
                    <button 
                        className={filter === 'all' ? 'active' : ''} 
                        onClick={() => setFilter('all')}
                    >
                        Todos ({confirmaciones.length})
                    </button>
                    <button 
                        className={filter === 'asistira' ? 'active' : ''} 
                        onClick={() => setFilter('asistira')}
                    >
                        Asistirá ({totalAsistira})
                    </button>
                    <button 
                        className={filter === 'no_asistira' ? 'active' : ''} 
                        onClick={() => setFilter('no_asistira')}
                    >
                        No Asistirá ({totalNoAsistira})
                    </button>
                </div>
                <button className="download-btn" onClick={descargarExcel}>
                    📥 Descargar Excel
                </button>
            </div>

            {/* Tabla de confirmaciones */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Acompañantes</th>
                            <th>Fecha de Confirmación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtradas.map((conf) => {
                            let fechaFormato = 'N/A';
                            if (conf.timestamp) {
                                try {
                                    // Manejar tanto Timestamp de Firebase como Date
                                    const fecha = conf.timestamp.toDate ? conf.timestamp.toDate() : new Date(conf.timestamp);
                                    fechaFormato = fecha.toLocaleDateString('es-ES');
                                } catch (e) {
                                    fechaFormato = 'N/A';
                                }
                            }
                            
                            return (
                                <tr key={conf.id} className={conf.estado}>
                                    <td>{conf.nombre || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${conf.estado}`}>
                                            {conf.estado === 'asistira' ? '✓ Asistirá' : '✗ No asistirá'}
                                        </span>
                                    </td>
                                    <td>{conf.acompanantes || 0}</td>
                                    <td>{fechaFormato}</td>
                                    <td>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDelete(conf.id, conf.nombre)}
                                            title="Eliminar registro"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
