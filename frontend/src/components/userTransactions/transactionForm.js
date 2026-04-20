import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function TransactionForm({ categories, onSubmit, isDeleting, isSaving, transaction, onDelete }) {
    const { register, handleSubmit, watch, reset, formState } = useForm();
    const date = useRef({});
    date.current = watch('date');
    const navigate = useNavigate()

    useEffect(() => {
        if (transaction && transaction.transactionId) {
            reset({
                category: String(transaction.categoryId),
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date.split('T')[0]
            })
        }
    }, [reset, transaction])

    const deleteTransaction = (e, id) => {
        e.preventDefault()
        onDelete(id)
    }

    const cancelProcess = (e) => {
        e.preventDefault()
        navigate('/user/transactions')
    }

    return (
        <div className="modern-transaction-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                
                {/* Category Selection */}
                <div className='form-section'>
                    <label className="section-label">
                        <i className="fas fa-tags"></i>
                        Category
                    </label>
                    <select 
                        className="modern-select"
                        {...register('category', {
                            required: "Category is required"
                        })}
                    >
                        <option value="">Select a category</option>
                        {categories.filter(cat => cat.enabled).map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                    {formState.errors.category && <small className="error-text">{formState.errors.category.message}</small>}
                </div>

                {/* Amount and Date Row */}
                <div className="form-row">
                    <div className='form-section'>
                        <label className="section-label">
                            <i className="fas fa-rupee-sign"></i>
                            Amount
                        </label>
                        <input
                            type='number'
                            step="0.01"
                            className="modern-input"
                            placeholder="Enter amount"
                            {...register('amount', {
                                required: "Amount is required!",
                                min: { value: 0.01, message: "Amount must be greater than 0!" }
                            })}
                        />
                        {formState.errors.amount && <small className="error-text">{formState.errors.amount.message}</small>}
                    </div>

                    <div className='form-section'>
                        <label className="section-label">
                            <i className="fas fa-calendar-alt"></i>
                            Date
                        </label>
                        <input
                            type='date'
                            className="modern-input"
                            value={(date.current === undefined) ? new Date().toISOString().split('T')[0] : date.current}
                            {...register('date')}
                        />
                        {formState.errors.date && <small className="error-text">{formState.errors.date.message}</small>}
                    </div>
                </div>

                {/* Description */}
                <div className='form-section'>
                    <label className="section-label">
                        <i className="fas fa-align-left"></i>
                        Description (Optional)
                    </label>
                    <input
                        type='text'
                        className="modern-input"
                        placeholder="Enter transaction description"
                        {...register('description', {
                            maxLength: {
                                value: 50,
                                message: "Description can have at most 50 characters!"
                            }
                        })}
                    />
                    {formState.errors.description && <small className="error-text">{formState.errors.description.message}</small>}
                </div>

                {/* Action Buttons */}
                <div className='form-actions'>
                    <button 
                        type='submit' 
                        className={`save-btn ${isSaving ? 'loading' : ''}`}
                        disabled={isSaving}
                    >
                        <i className="fas fa-check"></i>
                        {isSaving ? "Saving..." : 'Save Transaction'}
                    </button>
                    <button 
                        type='button' 
                        className='cancel-btn' 
                        onClick={cancelProcess}
                    >
                        <i className="fas fa-times"></i>
                        Cancel
                    </button>
                </div>

                {/* Delete Button (for edit mode) */}
                {transaction && (
                    <div className='delete-section'>
                        <button
                            type="button"
                            className={`delete-btn ${isDeleting ? 'loading' : ''}`}
                            onClick={(e) => deleteTransaction(e, transaction.transactionId)}
                            disabled={isDeleting}
                        >
                            <i className="fas fa-trash"></i>
                            {isDeleting ? "Deleting..." : 'Delete Transaction'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default TransactionForm;