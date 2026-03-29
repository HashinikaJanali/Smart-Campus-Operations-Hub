import React from 'react';

function ResourceTable({ resources, onEdit, onDelete }) {

    const getStatusStyle = (status) => {
        if (status === 'ACTIVE') return styles.activeStatus;
        return styles.inactiveStatus;
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'LECTURE_HALL': return '🏛️';
            case 'LAB': return '🔬';
            case 'MEETING_ROOM': return '🤝';
            case 'EQUIPMENT': return '📽️';
            default: return '📦';
        }
    }

    if (resources.length === 0) {
        return (
            <div style={styles.empty}>
                No resources found!
            </div>
        );
    }

    return (
        <div style={styles.tableCard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Resource</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Location</th>
                        <th style={styles.th}>Capacity</th>
                        <th style={styles.th}>Available</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource) => (
                        <tr key={resource.id} style={styles.tr}>
                            <td style={styles.td}>
                                <div style={styles.resourceCell}>
                                    <span style={styles.icon}>
                                        {getTypeIcon(resource.type)}
                                    </span>
                                    <div>
                                        <div style={styles.resourceName}>
                                            {resource.name}
                                        </div>
                                        <div style={styles.resourceDesc}>
                                            {resource.description}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.typeBadge}>
                                    {resource.type}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.mutedText}>
                                    {resource.location}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.mutedText}>
                                    {resource.capacity || '—'}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.mutedText}>
                                    {resource.availableFrom} – {resource.availableTo}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <span style={getStatusStyle(resource.status)}>
                                    {resource.status}
                                </span>
                            </td>
                            <td style={styles.td}>
                                <div style={styles.actionBtns}>
                                    <button
                                        style={styles.editBtn}
                                        onClick={() => onEdit(resource)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => onDelete(resource.id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    tableCard: {
        background: '#131929',
        border: '1px solid #1e2d45',
        borderRadius: '14px',
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '12px 20px',
        textAlign: 'left',
        fontSize: '11px',
        fontWeight: '600',
        color: '#6b7fa3',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        background: '#1a2236',
        borderBottom: '1px solid #1e2d45'
    },
    tr: {
        borderBottom: '1px solid #1e2d45',
        transition: 'background 0.15s'
    },
    td: {
        padding: '14px 20px',
        fontSize: '13.5px',
        color: '#e8edf5'
    },
    resourceCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    icon: {
        fontSize: '20px',
        width: '36px',
        height: '36px',
        background: 'rgba(59,130,246,0.15)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    resourceName: {
        fontWeight: '600',
        color: '#e8edf5'
    },
    resourceDesc: {
        fontSize: '11px',
        color: '#6b7fa3',
        marginTop: '2px'
    },
    typeBadge: {
        background: 'rgba(59,130,246,0.15)',
        color: '#3b82f6',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600'
    },
    mutedText: {
        color: '#6b7fa3',
        fontSize: '13px'
    },
    activeStatus: {
        background: 'rgba(16,185,129,0.15)',
        color: '#10b981',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600'
    },
    inactiveStatus: {
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600'
    },
    actionBtns: {
        display: 'flex',
        gap: '8px'
    },
    editBtn: {
        background: 'rgba(59,130,246,0.15)',
        color: '#3b82f6',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    deleteBtn: {
        background: 'rgba(239,68,68,0.15)',
        color: '#ef4444',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    empty: {
        textAlign: 'center',
        padding: '60px',
        color: '#6b7fa3',
        fontSize: '16px',
        background: '#131929',
        borderRadius: '14px',
        border: '1px solid #1e2d45'
    }
}

export default ResourceTable;