# SoulScript Improvement Proposals (SIP)

## What is a SIP?

A SoulScript Improvement Proposal (SIP) is a design document providing information to the SoulScript community, describing a new feature or process for the language. SIPs are the primary mechanism for proposing major new features, collecting community input, and documenting design decisions.

## SIP Types

- **Standard**: Describes any change that affects most or all SoulScript implementations
- **Informational**: Describes a design issue or provides general guidelines
- **Process**: Describes a process surrounding SoulScript or proposes a change to a process

## SIP Status

- **Draft**: Initial proposal under discussion
- **Review**: Formally submitted for peer review
- **Accepted**: Approved for implementation
- **Final**: Implemented in the language
- **Deferred**: Postponed for future consideration
- **Rejected**: Not accepted for implementation
- **Withdrawn**: Removed by the author(s)

## SIP Format

# SIP-XXX: Title

- **Status**: [Current status of the proposal]
- **Authors**: [List of authors/contributors]
- **Summary**: A brief (~200 word) description of the feature or change.
- **Motivation**: Why is this change necessary? What problems does it solve?
- **Specification**: Detailed technical description of the proposed change.
- **Rationale**: Why was this design chosen over alternatives?
- **Backwards Compatibility**: Impact on existing code and migration path if applicable.
- **Reference Implementation**: Link to implementation or proof of concept if available.

## Submitting a SIP

1. Fork the SoulScript repository
2. Create a new branch for your SIP
3. Create your SIP using the format above
4. Submit a pull request

## SIP Workflow

1. **Discussion**: Initial informal discussion in community discord
2. **Draft**: Author submits initial proposal
3. **Review**: Community and core team review
4. **Update**: Author revises based on feedback
5. **Decision**: Core team accepts or rejects
6. **Implementation**: If accepted, feature is implemented

## Current SIPs

- [SIP-0001: Evolving Memory Graph via `recall_count` and Dynamic Edge Weights](./sip_0001.md)
