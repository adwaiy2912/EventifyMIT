CREATE OR REPLACE PROCEDURE INSERT_EVENT (
    v_event_id IN EVENTS.EVENT_ID%TYPE,
    v_event_name IN EVENTS.EVENT_NAME%TYPE,
    v_event_description IN EVENTS.EVENT_DESCRIPTION%TYPE,
    v_event_type_id IN EVENTS.EVENT_TYPE_ID%TYPE,
    v_venue_id IN EVENTS.VENUE_ID%TYPE,
    v_organizer_id IN EVENTS.ORGANIZER_ID%TYPE,
    v_event_date IN EVENTS.EVENT_DATE%TYPE,
    v_event_time IN EVENTS.EVENT_TIME%TYPE,
    v_registration_deadline IN EVENTS.REGISTRATION_DEADLINE%TYPE
)
AS
BEGIN
    -- Insert a new record into the EVENTS table
    INSERT INTO EVENTS (
        EVENT_ID,
        EVENT_NAME,
        EVENT_DESCRIPTION,
        EVENT_TYPE_ID,
        VENUE_ID,
        ORGANIZER_ID,
        EVENT_DATE,
        EVENT_TIME,
        REGISTRATION_DEADLINE
    ) VALUES (
        v_event_id,
        v_event_name,
        v_event_description,
        v_event_type_id,
        v_venue_id,
        v_organizer_id,
        v_event_date,
        v_event_time,
        v_registration_deadline
    );

    DBMS_OUTPUT.PUT_LINE('Event created successfully!');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
END INSERT_EVENT;
/
