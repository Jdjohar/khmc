import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Topbar from '../component/TopNavBar';

const IncentiveType = () => {
    const [formData, setFormData] = useState({
        typeName: '',
        typeTests: [],
    });
    const [incentiveTypes, setIncentiveTypes] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedIncentiveTypeId, setSelectedIncentiveTypeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchIncentiveTypes = async () => {
            try {
                const response = await fetch('https://khmc-xdlm.onrender.com/api/incentiveType');
                const data = await response.json();
                setIncentiveTypes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching incentive types:', error);
                setLoading(false);
            }
        };

        const fetchTests = async () => {
            try {
                const response = await fetch('https://khmc-xdlm.onrender.com/api/testName');
                const data = await response.json();
                setTests(data);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchIncentiveTypes();
        fetchTests();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectTests = (selectedTests) => {
        const updatedTypeTests = selectedTests.map((test) => ({
            TestId: test.value,
            TestIncentiveValueType: '',
            IncentivePercentageValue: '',
            TestIncentiveValue: '',
            TestPrice: test.rate || 0,
        }));
        setFormData((prevData) => ({
            ...prevData,
            typeTests: updatedTypeTests,
        }));
    };

    const handleTestFieldChange = (index, field, value) => {
        const updatedTests = formData.typeTests.map((test, i) => {
            if (i === index) {
                let updatedTest = { ...test, [field]: value };
    
                if (field === 'TestIncentiveValueType') {
                    // Reset fields based on the selected type
                    if (value === 'percentage') {
                        updatedTest.IncentivePercentageValue = ''; // clear percentage value initially
                        updatedTest.TestIncentiveValue = ''; // clear incentive value initially
                    } else if (value === 'amount') {
                        updatedTest.TestIncentiveValue = ''; // allow manual entry
                        delete updatedTest.IncentivePercentageValue; // remove percentage field if switching to amount
                    }
                }
    
                // If IncentivePercentageValue is updated and type is percentage, recalculate TestIncentiveValue
                if (field === 'IncentivePercentageValue' && test.TestIncentiveValueType === 'percentage') {
                    const percentageValue = parseFloat(value) || 0;
                    updatedTest.TestIncentiveValue = (updatedTest.TestPrice / 100) * percentageValue;
                }
    
                return updatedTest;
            }
            return test;
        });
    
        setFormData((prevData) => ({
            ...prevData,
            typeTests: updatedTests,
        }));
    };
    

    const handleSelectAllTests = () => {
        if (selectAll) {
            setFormData({ ...formData, typeTests: [] });
        } else {
            const updatedTypeTests = tests.map((test) => ({
                TestId: test._id,
                TestIncentiveValueType: '',
                IncentivePercentageValue: '',
                TestIncentiveValue: '',
                TestPrice: test.Rate || 0,
            }));
            setFormData({ ...formData, typeTests: updatedTypeTests });
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `https://khmc-xdlm.onrender.com/api/incentiveType/${selectedIncentiveTypeId || ''}`,
                {
                    method: selectedIncentiveTypeId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                const result = await response.json();
                alert(`Incentive type ${selectedIncentiveTypeId ? 'updated' : 'created'} successfully!`);
                setIncentiveTypes((prevIncentiveTypes) =>
                    selectedIncentiveTypeId
                        ? prevIncentiveTypes.map((type) => (type._id === selectedIncentiveTypeId ? result : type))
                        : [...prevIncentiveTypes, result]
                );
                resetForm();
            } else {
                alert('Failed to save incentive type');
            }
        } catch (error) {
            console.error('Error saving incentive type:', error);
        }
    };

    const resetForm = () => {
        setFormData({ typeName: '', typeTests: [] });
        setSelectedIncentiveTypeId(null);
        setSelectAll(false);
    };

    const handleCancel = () => {
        window.location.reload();
    };

    const handleDelete = async () => {
        if (!selectedIncentiveTypeId) return;

        try {
            const response = await fetch(`https://khmc-xdlm.onrender.com/api/incentiveType/${selectedIncentiveTypeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Incentive type deleted successfully');
                setIncentiveTypes((prevIncentiveTypes) =>
                    prevIncentiveTypes.filter((type) => type._id !== selectedIncentiveTypeId)
                );
                resetForm();
            } else {
                alert('Failed to delete incentive type');
            }
        } catch (error) {
            console.error('Error deleting incentive type:', error);
        }
    };

    const handleRowClick = (incentiveType) => {
        const selectedTests = incentiveType.typeTests.map((test) => ({
            TestId: test.TestId,
            TestIncentiveValueType: test.TestIncentiveValueType,
            IncentivePercentageValue: test.IncentivePercentageValue || '',
            TestIncentiveValue: test.TestIncentiveValue,
            TestPrice: test.TestPrice,
        }));

        setFormData({
            typeName: incentiveType.typeName,
            typeTests: selectedTests,
        });
        setSelectedIncentiveTypeId(incentiveType._id);
        setSelectAll(false);
    };

    return (
        <>
            <Topbar />
            <div className="container-fluid p-0 page-body-wrapper">
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">Incentive Type</h3>
                        </div>
                        <div className="row">
                            <div className="col-4 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Incentive Types</h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Type Name</th>
                                                    <th>Number of Tests</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incentiveTypes.map((type) => (
                                                    <tr
                                                        key={type._id}
                                                        onClick={() => handleRowClick(type)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td>{type.typeName}</td>
                                                        <td>{type.typeTests.length}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col-8 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="forms-sample" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>Type Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="typeName"
                                                    value={formData.typeName}
                                                    onChange={handleChange}
                                                    placeholder="Enter Incentive Type Name"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Select Tests</label>
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectAll}
                                                        onChange={handleSelectAllTests}
                                                    />
                                                    <label className="ms-2">Select All Tests</label>
                                                </div>
                                                <Select
                                                    options={tests.map((test) => ({
                                                        value: test._id,
                                                        label: test.TestName,
                                                        rate: test.Rate,
                                                    }))}
                                                    isMulti
                                                    onChange={handleSelectTests}
                                                    placeholder="Select Tests"
                                                    value={formData.typeTests.map((test) => ({
                                                        value: test.TestId,
                                                        label: tests.find((t) => t._id === test.TestId)?.TestName,
                                                    }))}
                                                />
                                            </div>

                                            {formData.typeTests.map((test, index) => {
                                                const testName = tests.find((t) => t._id === test.TestId)?.TestName || `Test ${index + 1}`;

                                                return (
                                                    <div key={index} className="form-group">
                                                        <label>{testName}</label>

                                                        {/* Select for TestIncentiveValueType */}
                                                        <select
                                                            className="form-control"
                                                            value={test.TestIncentiveValueType}
                                                            onChange={(e) => handleTestFieldChange(index, 'TestIncentiveValueType', e.target.value)}
                                                        >
                                                            <option value="">Select Option</option>
                                                            <option value="amount">Amount</option>
                                                            <option value="percentage">Percentage</option>
                                                        </select>

                                                        {/* Display IncentivePercentageValue input if TestIncentiveValueType is "percentage" */}
                                                        {test.TestIncentiveValueType === 'percentage' && (
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Incentive Percentage Value"
                                                                value={test.IncentivePercentageValue || ''}
                                                                onChange={(e) => handleTestFieldChange(index, 'IncentivePercentageValue', e.target.value)}
                                                            />
                                                        )}

                                                        {/* TestIncentiveValue input */}
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder={test.TestIncentiveValueType === 'percentage' ? "Calculated Incentive Value" : "Incentive Amount Value"}
                                                            value={test.TestIncentiveValue || ''}
                                                            onChange={(e) =>
                                                                test.TestIncentiveValueType === 'amount' && handleTestFieldChange(index, 'TestIncentiveValue', e.target.value)
                                                            }
                                                            readOnly={test.TestIncentiveValueType === 'percentage'} // readOnly if type is percentage
                                                        />

                                                        {/* TestPrice input */}
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Test Price"
                                                            value={test.TestPrice || ''}
                                                            onChange={(e) => handleTestFieldChange(index, 'TestPrice', e.target.value)}
                                                        />
                                                    </div>
                                                );
                                            })}



                                            <button type="submit" className="btn btn-gradient-primary me-2">
                                                {selectedIncentiveTypeId ? 'Update' : 'Submit'}
                                            </button>
                                            {selectedIncentiveTypeId && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger me-2"
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            <button className="btn btn-light" type="button" onClick={handleCancel}>
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IncentiveType;
