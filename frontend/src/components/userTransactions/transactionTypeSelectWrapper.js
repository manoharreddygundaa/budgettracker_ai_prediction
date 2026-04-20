function TransactionTypeSelectWrapper({transactionTypes, setTransactionType, activeTransactionType}) {
    return (
        <div className='t-type-wrapper'>
            <h3>Transaction Type</h3>
            <div className='t-type-list'>
                {transactionTypes.map((type) => (
                    <button 
                        key={type.id} 
                        type="button"
                        className={activeTransactionType === type.id ? 'active' : ''} 
                        onClick={() => setTransactionType(type.id)}
                    >
                        {type.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TransactionTypeSelectWrapper;