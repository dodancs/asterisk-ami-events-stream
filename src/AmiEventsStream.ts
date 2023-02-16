/**
 * Developer: Alex Voronyansky <belirafon@gmail.com>
 * Date: 14.11.2014
 * Time: 12:28
 */

import { Transform, TransformCallback } from 'stream';
import eventUtils from '@dodancs/asterisk-ami-event-utils';

const COMMAND_END = '--END COMMAND--';

export type AmiEventType = 'AgentCalled' | 'AgentComplete' | 'AgentConnect' | 'AgentDump' | 'AgentLogin' | 'AgentLogoff' | 'AgentRingNoAnswer' | 'Agents' |
    'AgentsComplete' | 'AGIExecEnd' | 'AGIExecStart' | 'Alarm' | 'AlarmClear' | 'AOC-D' | 'AOC-E' | 'AOC-S' | 'AorDetail' | 'AorList' |
    'AorListComplete' | 'AsyncAGIEnd' | 'AsyncAGIExec' | 'AsyncAGIStart' | 'AttendedTransfer' | 'AuthDetail' | 'AuthList' | 'AuthListComplete' |
    'AuthMethodNotAllowed' | 'BlindTransfer' | 'BridgeCreate' | 'BridgeDestroy' | 'BridgeEnter' | 'BridgeInfoChannel' | 'BridgeInfoComplete' |
    'BridgeLeave' | 'BridgeMerge' | 'BridgeVideoSourceUpdate' | 'Cdr' | 'CEL' | 'ChallengeResponseFailed' | 'ChallengeSent' | 'ChannelTalkingStart' |
    'ChannelTalkingStop' | 'ChanSpyStart' | 'ChanSpyStop' | 'ConfbridgeEnd' | 'ConfbridgeJoin' | 'ConfbridgeLeave' | 'ConfbridgeList' |
    'ConfbridgeListRooms' | 'ConfbridgeMute' | 'ConfbridgeRecord' | 'ConfbridgeStart' | 'ConfbridgeStopRecord' | 'ConfbridgeTalking' |
    'ConfbridgeUnmute' | 'ContactList' | 'ContactListComplete' | 'ContactStatus' | 'ContactStatusDetail' | 'CoreShowChannel' |
    'CoreShowChannelsComplete' | 'DAHDIChannel' | 'DeadlockStart' | 'DeviceStateChange' | 'DeviceStateListComplete' | 'DialBegin' | 'DialEnd' |
    'DialState' | 'DNDState' | 'DTMFBegin' | 'DTMFEnd' | 'EndpointDetail' | 'EndpointDetailComplete' | 'EndpointList' | 'EndpointListComplete' |
    'ExtensionStateListComplete' | 'ExtensionStatus' | 'FailedACL' | 'FAXSession' | 'FAXSessionsComplete' | 'FAXSessionsEntry' | 'FAXStats' |
    'FAXStatus' | 'Flash' | 'FullyBooted' | 'Hangup' | 'HangupHandlerPop' | 'HangupHandlerPush' | 'HangupHandlerRun' | 'HangupRequest' | 'Hold' |
    'IdentifyDetail' | 'InvalidAccountID' | 'InvalidPassword' | 'InvalidTransport' | 'Load' | 'LoadAverageLimit' | 'LocalBridge' |
    'LocalOptimizationBegin' | 'LocalOptimizationEnd' | 'LogChannel' | 'MCID' | 'MeetmeEnd' | 'MeetmeJoin' | 'MeetmeLeave' | 'MeetmeList' |
    'MeetmeListRooms' | 'MeetmeMute' | 'MeetmeTalking' | 'MeetmeTalkRequest' | 'MemoryLimit' | 'MessageWaiting' | 'MiniVoiceMail' | 'MixMonitorMute' |
    'MixMonitorStart' | 'MixMonitorStop' | 'MonitorStart' | 'MonitorStop' | 'MusicOnHoldStart' | 'MusicOnHoldStop' | 'MWIGet' | 'MWIGetComplete' |
    'NewAccountCode' | 'NewCallerid' | 'Newchannel' | 'NewConnectedLine' | 'NewExten' | 'Newstate' | 'OriginateResponse' | 'ParkedCall' |
    'ParkedCallGiveUp' | 'ParkedCallSwap' | 'ParkedCallTimeOut' | 'PeerStatus' | 'Pickup' | 'PresenceStateChange' | 'PresenceStateListComplete' |
    'PresenceStatus' | 'QueueCallerAbandon' | 'QueueCallerJoin' | 'QueueCallerLeave' | 'QueueEntry' | 'QueueMemberAdded' | 'QueueMemberPause' |
    'QueueMemberPenalty' | 'QueueMemberRemoved' | 'QueueMemberRinginuse' | 'QueueMemberStatus' | 'QueueParams' | 'ReceiveFAX' | 'Registry' | 'Reload' |
    'Rename' | 'RequestBadFormat' | 'RequestNotAllowed' | 'RequestNotSupported' | 'RTCPReceived' | 'RTCPSent' | 'SendFAX' | 'SessionLimit' |
    'SessionTimeout' | 'Shutdown' | 'SIPQualifyPeerDone' | 'SoftHangupRequest' | 'SpanAlarm' | 'SpanAlarmClear' | 'Status' | 'StatusComplete' |
    'SuccessfulAuth' | 'TransportDetail' | 'UnexpectedAddress' | 'Unhold' | 'Unload' | 'UnParkedCall' | 'UserEvent' | 'VarSet' | 'Wink';

export type AmiActionType = 'AbsoluteTimeout' | 'AgentLogoff' | 'Agents' | 'AGI' | 'AOCMessage' | 'Atxfer' | 'BlindTransfer' | 'Bridge' | 'BridgeDestroy' |
    'BridgeInfo' | 'BridgeKick' | 'BridgeList' | 'BridgeTechnologyList' | 'BridgeTechnologySuspend' | 'BridgeTechnologyUnsuspend' | 'CancelAtxfer' |
    'Challenge' | 'ChangeMonitor' | 'Command' | 'ConfbridgeKick' | 'ConfbridgeList' | 'ConfbridgeListRooms' | 'ConfbridgeLock' | 'ConfbridgeMute' |
    'ConfbridgeSetSingleVideoSrc' | 'ConfbridgeStartRecord' | 'ConfbridgeStopRecord' | 'ConfbridgeUnlock' | 'ConfbridgeUnmute' | 'ControlPlayback' |
    'CoreSettings' | 'CoreShowChannels' | 'CoreStatus' | 'CreateConfig' | 'DAHDIDialOffhook' | 'DAHDIDNDoff' | 'DAHDIDNDon' | 'DAHDIHangup' |
    'DAHDIRestart' | 'DAHDIShowChannels' | 'DAHDITransfer' | 'DataGet' | 'DBDel' | 'DBDelTree' | 'DBGet' | 'DBGetTree' | 'DBPut' | 'DeviceStateList' |
    'DialplanExtensionAdd' | 'DialplanExtensionRemove' | 'Events' | 'ExtensionState' | 'ExtensionStateList' | 'FAXSession' | 'FAXSessions' |
    'FAXStats' | 'Filter' | 'FilterList' | 'GetConfig' | 'GetConfigJSON' | 'Getvar' | 'Hangup' | 'IAXnetstats' | 'IAXpeerlist' | 'IAXpeers' |
    'IAXregistry' | 'JabberSend_res_xmpp' | 'ListCategories' | 'ListCommands' | 'LocalOptimizeAway' | 'LoggerRotate' | 'Login' | 'Logoff' |
    'MailboxCount' | 'MailboxStatus' | 'MeetmeList' | 'MeetmeListRooms' | 'MeetmeMute' | 'MeetmeUnmute' | 'MessageSend' | 'MixMonitor' |
    'MixMonitorMute' | 'ModuleCheck' | 'ModuleLoad' | 'Monitor' | 'MuteAudio' | 'MWIDelete' | 'MWIGet' | 'MWIUpdate' | 'Originate' | 'Park' |
    'ParkedCalls' | 'Parkinglots' | 'PauseMonitor' | 'Ping' | 'PJSIPNotify' | 'PJSIPQualify' | 'PJSIPRegister' | 'PJSIPShowAors' | 'PJSIPShowAuths' |
    'PJSIPShowContacts' | 'PJSIPShowEndpoint' | 'PJSIPShowEndpoints' | 'PJSIPShowRegistrationInboundContactStatuses' |
    'PJSIPShowRegistrationsInbound' | 'PJSIPShowRegistrationsOutbound' | 'PJSIPShowResourceLists' | 'PJSIPShowSubscriptionsInbound' |
    'PJSIPShowSubscriptionsOutbound' | 'PJSIPUnregister' | 'PlayDTMF' | 'PlayMF' | 'PresenceState' | 'PresenceStateList' | 'PRIDebugFileSet' |
    'PRIDebugFileUnset' | 'PRIDebugSet' | 'PRIShowSpans' | 'QueueAdd' | 'QueueChangePriorityCaller' | 'QueueLog' | 'QueueMemberRingInUse' |
    'QueuePause' | 'QueuePenalty' | 'QueueReload' | 'QueueRemove' | 'QueueReset' | 'QueueRule' | 'Queues' | 'QueueStatus' | 'QueueSummary' |
    'QueueWithdrawCaller' | 'Redirect' | 'Reload' | 'SendText' | 'Setvar' | 'ShowDialPlan' | 'SIPnotify' | 'SIPpeers' | 'SIPpeerstatus' |
    'SIPqualifypeer' | 'SIPshowpeer' | 'SIPshowregistry' | 'SKINNYdevices' | 'SKINNYlines' | 'SKINNYshowdevice' | 'SKINNYshowline' |
    'SorceryMemoryCacheExpire' | 'SorceryMemoryCacheExpireObject' | 'SorceryMemoryCachePopulate' | 'SorceryMemoryCacheStale' |
    'SorceryMemoryCacheStaleObject' | 'Status' | 'StopMixMonitor' | 'StopMonitor' | 'UnpauseMonitor' | 'UpdateConfig' | 'UserEvent' |
    'VoicemailRefresh' | 'VoicemailUsersList' | 'VoicemailUserStatus' | 'WaitEvent';

export type AmiResponseType = 'Success' | 'Error' | 'Follows' | 'Result will follow';

export type AmiChannelStateDescType = 'Down' | 'Rsrvd' | 'OffHook' | 'Dialing' | 'Ring' | 'Ringing' | 'Up' | 'Busy' | 'Dialing Offhook' | 'Pre-ring' | 'Unknown';

export type AmiEvent = {
    Event: AmiEventType;

    AccountCode?: string;
    AccountID?: string;
    ActionID?: string;
    Agent?: string;
    Alarm?: string;
    AuthenticateQualify?: string;
    AuthMethod?: string;
    AuthType?: string;
    BillingID?: "Normal" | "Reverse" | "CreditCard" | "CallForwardingUnconditional" | "CallForwardingBusy" | "CallForwardingNoReply" | "CallDeflection" | "CallTransfer" | "NotAvailable";
    CallerIDName?: string;
    CallerIDNum?: string;
    CallStarted?: Date;
    Channel?: any;
    ChannelState?: number;
    ChannelStateDesc?: AmiChannelStateDescType;
    Charge?: string;
    ChargingAssociation?: string;
    ChargingType?: string;
    Command?: string;
    CommandId?: string;
    ConnectedLineName?: string;
    ConnectedLineNum?: string;
    ContactsRegistered?: string;
    Context?: string;
    Cost?: string;
    Currency?: string;
    DAHDIChannel?: string;
    DefaultExpiration?: string;
    DestAccountCode?: string;
    DestApp?: string;
    DestBridgeUniqueid?: string;
    DestCallerIDName?: string;
    DestCallerIDNum?: string;
    DestChannel?: string;
    DestChannelState?: string;
    DestChannelStateDesc?: AmiChannelStateDescType;
    DestConnectedLineName?: string;
    DestConnectedLineNum?: string;
    DestContext?: string;
    DestExten?: string;
    DestLanguage?: string;
    DestLinkedid?: string;
    DestPriority?: string;
    DestTransfererChannel?: string;
    DestType?: "Bridge" | "App" | "Link" | "Threeway" | "Fail";
    DestUniqueid?: string;
    EndpointName?: string;
    Env?: string;
    EventList?: string;
    EventTV?: string;
    EventVersion?: string;
    Exten?: string;
    Granularity?: string;
    HoldTime?: Date;
    ID?: string;
    Interface?: string;
    Language?: string;
    Length?: string;
    Linkedid?: string;
    ListItems?: string;
    LocalAddress?: string;
    LocalOneAccountCode?: string;
    LocalOneCallerIDName?: string;
    LocalOneCallerIDNum?: string;
    LocalOneChannel?: string;
    LocalOneChannelState?: string;
    LocalOneChannelStateDesc?: AmiChannelStateDescType;
    LocalOneConnectedLineName?: string;
    LocalOneConnectedLineNum?: string;
    LocalOneContext?: string;
    LocalOneExten?: string;
    LocalOneLanguage?: string;
    LocalOneLinkedid?: string;
    LocalOnePriority?: string;
    LocalOneUniqueid?: string;
    LocalTwoAccountCode?: string;
    LocalTwoCallerIDName?: string;
    LocalTwoCallerIDNum?: string;
    LocalTwoChannel?: string;
    LocalTwoChannelState?: string;
    LocalTwoChannelStateDesc?: AmiChannelStateDescType;
    LocalTwoConnectedLineName?: string;
    LocalTwoConnectedLineNum?: string;
    LocalTwoContext?: string;
    LocalTwoExten?: string;
    LocalTwoLanguage?: string;
    LocalTwoLinkedid?: string;
    LocalTwoPriority?: string;
    LocalTwoUniqueid?: string;
    LoggedInTime?: Date;
    Logintime?: number;
    Mailboxes?: string;
    MaxContacts?: string;
    MaximumExpiration?: string;
    Md5Cred?: string;
    MemberName?: string;
    MinimumExpiration?: string;
    Module?: string;
    Multiplier?: "1/1000" | "1/100" | "1/10" | "1" | "10" | "100" | "1000";
    Name?: string;
    NonceLifetime?: string;
    Number?: string;
    NumberOf?: string;
    ObjectName?: string;
    ObjectType?: string;
    OrigBridgeCreator?: string;
    OrigBridgeName?: string;
    OrigBridgeNumChannels?: string;
    OrigBridgeTechnology?: string;
    OrigBridgeType?: string;
    OrigBridgeUniqueid?: string;
    OrigBridgeVideoSource?: string;
    OrigBridgeVideoSourceMode?: "talker" | "single";
    OrigTransfererAccountCode?: string;
    OrigTransfererCallerIDName?: string;
    OrigTransfererCallerIDNum?: string;
    OrigTransfererChannel?: string;
    OrigTransfererChannelState?: number;
    OrigTransfererChannelStateDesc?: AmiChannelStateDescType;
    OrigTransfererConnectedLineName?: string;
    OrigTransfererConnectedLineNum?: string;
    OrigTransfererContext?: string;
    OrigTransfererExten?: string;
    OrigTransfererLanguage?: string;
    OrigTransfererLinkedid?: string;
    OrigTransfererPriority?: string;
    OrigTransfererUniqueid?: string;
    OutboundProxy?: string;
    Password?: string;
    Plan?: string;
    Priority?: string;
    QualifyFrequency?: string;
    Queue?: string;
    Realm?: string;
    Reason?: "caller" | "agent" | "transfer";
    RemoteAddress?: string;
    RemoveExisting?: string;
    RemoveUnavailable?: string;
    Result?: string;
    ResultCode?: number;
    RingTime?: Date;
    Scale?: string;
    SecondBridgeCreator?: string;
    SecondBridgeName?: string;
    SecondBridgeNumChannels?: string;
    SecondBridgeTechnology?: string;
    SecondBridgeType?: string;
    SecondBridgeUniqueid?: string;
    SecondBridgeVideoSource?: string;
    SecondBridgeVideoSourceMode?: "talker" | "single";
    SecondTransfererAccountCode?: string;
    SecondTransfererCallerIDName?: string;
    SecondTransfererCallerIDNum?: string;
    SecondTransfererChannel?: string;
    SecondTransfererChannelState?: string;
    SecondTransfererChannelStateDesc?: AmiChannelStateDescType;
    SecondTransfererConnectedLineName?: string;
    SecondTransfererConnectedLineNum?: string;
    SecondTransfererContext?: string;
    SecondTransfererExten?: string;
    SecondTransfererLanguage?: string;
    SecondTransfererLinkedid?: string;
    SecondTransfererPriority?: string;
    SecondTransfererUniqueid?: string;
    Service?: string;
    SessionID?: string;
    SessionTV?: string;
    Severity?: "Informational" | "Error";
    SpecialCode?: string;
    Status?: "AGENT_LOGGEDOFF" | "AGENT_IDLE" | "AGENT_ONCALL";
    StepFunction?: string;
    SupportPath?: string;
    TalkTime?: Date;
    TotalContacts?: string;
    TotalType?: "SubTotal" | "Total";
    TransfereeAccountCode?: string;
    TransfereeCallerIDName?: string;
    TransfereeCallerIDNum?: string;
    TransfereeChannel?: string;
    TransfereeChannelState?: string;
    TransfereeChannelStateDesc?: AmiChannelStateDescType;
    TransfereeConnectedLineName?: string;
    TransfereeConnectedLineNum?: string;
    TransfereeContext?: string;
    TransfereeExten?: string;
    TransfereeLanguage?: string;
    TransfereeLinkedid?: string;
    TransfereePriority?: string;
    TransfereeUniqueid?: string;
    Type?: "NotAvailable" | "Free" | "Currency" | "Units";
    TypeOf?: string;
    Uniqueid?: string;
    Unit?: "Octect" | "Segment" | "Message";
    Units?: string;
    Username?: string;
};

/**
 * Ami Event Emitter
 */
export class AmiEventsStream extends Transform {

    private _parser: (obj: any) => any = eventUtils.toObject;
    private _rawData: Array<any> = [];
    private _sawFirstCrLf: boolean = false;
    private _buffer?: Buffer;
    private _lastAmiEvent?: AmiEventType;
    private _lastAmiResponse?: AmiResponseType;
    private _lastAmiAction?: AmiActionType;
    private _isEmitted: boolean = true;


    /**
     *
     * @returns {*}
     */
    getLastEvent() {
        return this._lastAmiEvent;
    }

    /**
     *
     * @returns {*}
     */
    get lastEvent() {
        return this.getLastEvent();
    }

    /**
     *
     * @returns {null}
     */
    getLastResponse() {
        return this._lastAmiResponse;
    }

    /**
     *
     * @returns {null}
     */
    get lastResponse() {
        return this.getLastResponse();
    }

    /**
     *
     * @returns {*}
     */
    getLastAction() {
        return this._lastAmiAction;
    }

    /**
     *
     * @returns {null}
     */
    get lastAction() {
        return this.getLastAction();
    }

    /**
     *
     * @param chunk
     * @param encoding
     * @param done
     * @private
     */
    _transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
        let chunkSlice = chunk;

        if (this._rawData.length) {
            chunkSlice = Buffer.concat(this._rawData.concat([chunkSlice]));
            this._rawData = [];
        }

        let parseGen = this._parse(chunkSlice);

        while (chunkSlice) {
            chunkSlice = parseGen.next(chunkSlice).value;
        }
        done();
    }

    /**
     *
     * @param chunk
     * @private
     */
    _analyzeSimple(chunk: Buffer) {
        let chunkLength = chunk.length;

        for (let i = 0; i < chunkLength; i++) {
            if (chunk[i] === 13 && i + 1 < chunkLength && chunk[i + 1] === 10) {
                i++;

                if (this._sawFirstCrLf) {
                    this._buffer = chunk.slice(0, i);
                    this._emission(this._buffer);
                    this._sawFirstCrLf = false;
                    return chunk.slice(i);

                } else {
                    this._sawFirstCrLf = true;
                }

            } else {
                this._sawFirstCrLf = false;
            }
        }
        this._rawData.push(chunk.slice(0));
        return null;
    }

    /**
     *
     * @param chunk
     * @private
     */
    _analyzeExtend(chunk: Buffer) {
        let chunkStr = eventUtils.toString(chunk),
            indexOfEnd = chunkStr.indexOf(COMMAND_END);

        if (chunkStr === '') {
            return null;
        }

        if (~indexOfEnd) {
            this._emission(chunk.slice(0, indexOfEnd + COMMAND_END.length + 1));
            return chunk.slice(indexOfEnd + COMMAND_END.length + 1);
        }
        this._rawData.push(chunk);
        return null;
    }

    /**
     *
     * @returns {null}
     * @private
     */
    * _parse(chunk: Buffer) {
        let chunkSlice = chunk;
        while (chunkSlice) {
            chunkSlice = this._isEmitted && !/^Response:\sFollows/i.test(eventUtils.toString(chunkSlice)) ?
                yield this._analyzeSimple(chunkSlice) : yield this._analyzeExtend(chunkSlice);
        }
        return null;
    }

    /**
     *
     * @param eventBuffer
     * @private
     */
    _emission(eventBuffer: Buffer) {
        let eventStr = eventUtils.toString(eventBuffer);

        if (eventStr.length) {
            if (/^Event/i.test(eventStr)) {
                this._lastAmiEvent = this._parser(eventBuffer);
                this.emit('amiEvent', this._lastAmiEvent);

            } else if (/^Action/i.test(eventStr)) {
                this._lastAmiAction = this._parser(eventBuffer);
                this.emit('amiAction', this._lastAmiAction);

            } else {
                this._lastAmiResponse = this._parser(eventBuffer);
                this.emit('amiResponse', this._lastAmiResponse);
            }
            this.push(eventUtils.fromString(eventStr));
        }

        this._isEmitted = true;
        return this;
    }
}
