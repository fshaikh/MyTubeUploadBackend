/**
 * Interface for functions to retreive key from event
 */
// Refer here for details for various AWS Services:
// Refer here for examples of event source JSON: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
export interface IKeyRetreiver{
    GetKeyFromEvent(event): string;
}