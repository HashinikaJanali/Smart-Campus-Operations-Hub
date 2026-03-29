import React, { useState } from 'react';

function ResourceFilter({ onFilter, onSearch }) {
    const [type, setType] = useState('ALL');
    const [status, setStatus] = useState('ALL');
    const [search, setSearch] = useState('');

    const handleTypeChange = (e) => {
        setType(e.target.value);
        onFilter(e.target.value, status);
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        onFilter(type, e.target.value);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    }

    const handleReset = () => {
        setType('ALL');
        setStatus('ALL');
        setSearch('');
        onFilter('ALL', 'ALL');
        onSearch('');
    }

    return (
        <div style={styles.filterBar}>
            {/* SEARCH */}
            <div style={styles.searchBox}>
                <span>🔍</span>
                <input
                    style={styles.searchInput}
                    type="text"
                    placeholder="Search by name or location..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* TYPE FILTER */}
            <select
                style={styles.select}
                value={type}
                onChange={handleTypeChange}
            >
                <option value="ALL">All Types</option>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
            </select>

            {/* STATUS FILTER */}
            <select
                style={styles.select}
                value={status}
                onChange={handleStatusChange}
            >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>

            {/* RESET */}
            <button style={styles.resetBtn} onClick={handleReset}>
                Reset
            </button>
        </div>
    );
}

const styles = {
    filterBar: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        background: '#131929',
        border: '1px solid #1e2d45',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '20px'
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
        background: '#1a2236',
        border: '1px solid #1e2d45',
        borderRadius: '8px',
        padding: '8px 14px'
    },
    searchInput: {
        background: 'none',
        border: 'none',
        outline: 'none',
        color: '#e8edf5',
        fontSize: '13px',
        width: '100%',
        fontFamily: 'sans-serif'
    },
    select: {
        background: '#1a2236',
        border: '1px solid #1e2d45',
        color: '#e8edf5',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        outline: 'none',
        cursor: 'pointer',
        fontFamily: 'sans-serif'
    },
    resetBtn: {
        background: '#1a2236',
        border: '1px solid #1e2d45',
        color: '#6b7fa3',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '13px',
        cursor: 'pointer',
        fontFamily: 'sans-serif'
    }
}

export default ResourceFilter;