import draftToHtml from 'draftjs-to-html';

const RaveloAccordion = ({ event, active, onClick, title, description }) => (
  <div className="accordion-item">
    <h5 className="accordion-header">
      <button
        className={`accordion-button${active === event ? "" : " collapsed"}`}
        aria-expanded={active === event ? "true" : "false"}
        onClick={() => onClick(event)}
        type="button"
      >
        {title}
      </button>
    </h5>
    <div className={`accordion-collapse collapse${active === event ? " show" : ""}`}>
      <div className="accordion-body">
        {description && (
          <div dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(description)) }} />
        )}
      </div>
    </div>
  </div>
);

export default RaveloAccordion;