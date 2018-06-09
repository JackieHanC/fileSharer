/*
* THIS FILE IS FOR TCP TEST
*/

/*
struct sockaddr_in {
        short   sin_family;
        u_short sin_port;
        struct  in_addr sin_addr;
        char    sin_zero[8];
};
*/

#include "sysInclude.h"

extern void tcp_DiscardPkt(char *pBuffer, int type);

extern void tcp_sendReport(int type);

extern void tcp_sendIpPkt(unsigned char *pData, UINT16 len, unsigned int  srcAddr, unsigned int dstAddr, UINT8	ttl);

extern int waitIpPacket(char *pBuffer, int timeout);

extern unsigned int getIpv4Address();

extern unsigned int getServerIpv4Address();
enum TCPStatus
{
	CLOSED,
	SYN_SENT,
	ESTABLISHED,
	FIN_WAIT1,
	FIN_WAIT2,
	TIME_WAIT
};
struct TCPHead {
	UINT16 srcPort;
	UINT16 dstPort;
	UINT32 seqNo;
	UINT32 ackNo;
	UINT8 headlen;
	UINT8 flag;
	UINT16 windowsize;
	UINT16 checksum;
	UINT16 urgentPointer;
	char data[100];
};
struct TCB {
	UINT32 srcAddr;
	UINT32 dstAddr;
	UINT32 srcPort;
	UINT32 dstPort;
	TCPStatus status;
	UINT16 seq;
	UINT16 ack;
	UINT16 sockfd;
	char * data;
};

struct TCB_LinkList {
	TCB_LinkList * next;
	TCB * tcb;
}
TCB_LinkList* TCB_Table;
TCB* cur_TCB;
int gSrcPort = 2005;
int gDstPort = 2006;
int gSeqNum = 0;
int gAckNum = 0;
int socknum = 5;
struct fakeHeader
{
	UINT32 srcAddr;
	UINT32 dstAddr;
	UINT16 protocol;
	UINT16 TCP_Length;
};
fakeHeader fake_Header;
// bool check(UINT16* fh, UINT16* pBuffer, UINT16 len) {
// 	UINT32 ret = 0;
// 	// fake header is 12 byte
// 	for (int i = 0; i < 6; ++i)
// 	{
// 		ret += ntohs(*fh);
// 		fh++;
// 	}

// 	for (int i = 0;i < len/2;++i) {
// 		ret += ntohs(*pBuffer);
// 		pBuffer++;
// 	}

// 	while(ret >> 16) {
// 		ret = (ret & 0xffff) + ret >> 16;
// 	}
// 	return ret;
// }
UINT32 getchecksum(TCPHead* header, UINT32 srcAddr, UINT32 dstAddr,
	 UINT16 len, char * data) {
	UINT32 checksum = 0;
	checksum += (srcAddr >> 16) + srcAddr&0xffff;
	checksum += (dstAddr >> 16) + dstAddr&0xffff;
	checksum += IPPROTO_TCP;
	checksum += 0x14;
	checksum += ntohs(header->srcPort) + ntohs(header->dstPort);
	checksum += header->seqNo >> 16 + header->seqNo & 0xffff;
	checksum += header->ackNo >> 16 + header->ackNo & 0xffff;
	checksum += header->headlen << 8 + header->flag;
	if (header->flag == PACKET_TYPE_DATA) {
		checksum += len - 0x14;
		int length = len;
		char* p = data;
		while (length > 0) {
			checksum += (*p) << 8;
			p++;
			checksum += (*p);
			p++;
			length -= 2;
		}
	}
	checksum += ntohs(header->windowsize);
	checksum += ntohs(header->urgentPointer);

	// checksum = (checksum >> )
	while (checksum >> 16) {
		checksum = (checksum >> 16) + checksum & 0xffff;
	}

	return (~checksum)&0xffff;
}

UINT32 getchecksum2(TCPHead* header, UINT32 srcAddr, UINT32 dstAddr,
	 UINT16 len, char * data) {
	UINT32 checksum = 0;
	checksum += (srcAddr >> 16) + srcAddr&0xffff;
	checksum += (dstAddr >> 16) + dstAddr&0xffff;
	checksum += IPPROTO_TCP;
	checksum += 0x14;
	checksum += (header->srcPort) + (header->dstPort);
	checksum += header->seqNo >> 16 + header->seqNo & 0xffff;
	checksum += header->ackNo >> 16 + header->ackNo & 0xffff;
	checksum += header->headlen << 8 + header->flag;
	if (header->flag == PACKET_TYPE_DATA) {
		checksum += len - 0x14;
		int length = len;
		char* p = data;
		while (length > 0) {
			checksum += (*p) << 8;
			p++;
			checksum += (*p);
			p++;
			length -= 2;
		}
	}
	checksum += (header->windowsize);
	checksum += (header->urgentPointer);

	// checksum = (checksum >> )
	while (checksum >> 16) {
		checksum = (checksum >> 16) + checksum & 0xffff;
	}

	return (~checksum)&0xffff;
}

int stud_tcp_input(char *pBuffer, unsigned short len, unsigned int srcAddr, unsigned int dstAddr)
{
	// // put info in fake header
	// fake_Header.srcAddr = srcAddr;
	// fake_Header.dstAddr = dstAddr;
	// fake_Header.protocol = 0;
	// fake_Header.protocol |= htons(8);
	// fake_Header.TCP_Length = htons(20);

	// // check checksum
	// if (check((UINT16*)&fake_Header, (UINT16*)pBuffer, len) != (UINT16)(-1)) {
	// 	tcp_sendReport();
	// }

	TCPHead* header = (TCPHead*)pBuffer;

	header->seqNo = ntohl(header->seqNo);
	header->ackNo = ntohl(header->ackNo);
	if (getchecksum(header, ntohl(srcAddr), ntohl(srcAddr), len, NULL) !=
		ntohs(header->checksum)) {
		return -1;
	}

	int seqAdd = 1;
	if (cur_TCB->status == FIN_WAIT2) {
		seqAdd = 0;
	}
	else if (len > 20) {
		seqAdd = len - 20;
	}

	if (header->ackNo != (cur_TCB->seq + seqAdd)) {
		tcp_DiscardPkt(pBuffer, STUD_TCP_TEST_SEQNO_ERROR);
		return -1;
	}

	switch (cur_TCB->status) {
		case SYN_SENT: {
			if (header->flag == PACKET_TYPE_SYN_ACK) {
				cur_TCB->status = ESTABLISHED;
				cur_TCB->ack = header->seqNo + 1;
				cur_TCB->seq = header->ackNo;
				stud_tcp_output(NULL, 0, PACKET_TYPE_ACK, cur_TCB->srcPort, cur_TCB->dstPort
					ntohl(srcAddr), ntohl(dstAddr));
				break;
			}
			else
				return -1;
		}
		case ESTABLISHED: {
			if (header->flag == PACKET_TYPE_ACK) {
				if (len > 20) {
					cur_TCB->ack = header->seqNo + len - 20;
					cur_TCB->seq = header->ackNo;
					break;
				}
				else if (len == 20) {
					cur_TCB->ack = header->seqNo + 1;
					cur_TCB->seq = header->ackNo;
					break;
				}
				else
					return -1;
			}else {
				return -1;
			}
		}
		case FIN_WAIT1: {
			if (header->flag == PACKET_TYPE_ACK) {
				cur_TCB->ack = header->seqNo + 1;
				cur_TCB->seq = header->ackNo;
				cur_TCB->status = FIN_WAIT2;
				break;
			} else {
				return -1;
			}


		}
		case FIN_WAIT2: {
			if (header->flag == PACKET_TYPE_ACK) {
				cur_TCB->status = TIME_WAIT;
				stud_tcp_output(NULL, 0, PACKET_TYPE_ACK, cur_TCB->srcPort, cur_TCB->dstPort,
					ntohl(srcAddr), ntohl(dstAddr));
				break;
			}else {
				return -1;
			}
		}
		default: 
			return -1;

	}
	return 0;
}

void stud_tcp_output(char *pData, unsigned short len, unsigned char flag, unsigned short srcPort, unsigned short dstPort, unsigned int srcAddr, unsigned int dstAddr)
{
	if (cur_TCB == NULL) {
		cur_TCB = new TCB;
		cur_TCB->seq = gSeqNum;
		cur_TCB->ack = gAckNum;
		cur_TCB->srcPort = srcPort;
		cur_TCB->dstPort = dstPort;
		cur_TCB->srcAddr = srcAddr;
		cur_TCB->dstAddr = dstAddr;
		cur_TCB->status = CLOSED;
	}

	TCPHead* head = new TCPHead;
	for (int i = 0; i < len; ++i)
	{
		head->data[i] = pData[i];
	}
	head->srcPort = srcPort;
	head->dstPort = dstPort;
	head->seqNo = cur_TCB->seq;
	head->ackNo = cur_TCB->ack;
	head->headlen = 0x50;
	head->flag = flag;
	head->windowsize = 1;
	header->urgentPointer = 0;

	switch (cur_TCB->status) {
		case CLOSED: {
			if (flag == PACKET_TYPE_SYN) {
				cur_TCB->status = SYN_SENT;
			} else {
				return;
			}
			break;
		}
		case ESTABLISHED: {
			if (flag == PACKET_TYPE_FIN_ACK) {
				cur_TCB->status = FIN_WAIT1;
				break;
			} else if (flag == PACKET_TYPE_DATA ||
				flag == PACKET_TYPE_ACK) {
				break;
			} else {
				return;
			}
			break;
		}
	}

	head->checksum = ntohs(checksum2(head, srcAddr, dstAddr, len, pData));
	head->srcPort = ntohs(head->srcPort);
	head->dstPort = ntohs(head->dstPort);
	head->seqNo = ntohl(head->seqNo);
	head->ackNo = ntohl(head->ackNo);
	head->windowsize = ntohs(head->windowsize);
	head->urgentPointer = ntohs(head->urgentPointer);
	tcp_sendIpPkt((unsigned char*)head, 20+len, cur_TCB->srcAddr,
		cur_TCB->dstAddr, 60);
}

int stud_tcp_socket(int domain, int type, int protocol)
{

	if (domain != AF_INET || type != SOCK_STREAM || protocol != IPPROTO_TCP)
		return -1;
	cur_TCB = new TCB;
	if (TCB_Table == NULL) {
		TCB_Table = new TCB_LinkList;
		TCB_Table->tcb = cur_TCB;
	}else {
		TCB_LinkList* head = TCB_Table;
		while(head->next != NULL) {
			head = head->next;
		}
		head->next = new TCB_LinkList;
		head->next->tcb = cur_TCB;
	}
	cur_TCB->sockfd = socknum++;
	cur_TCB->srcPort = gSrcPort++;
	cur_TCB->seq = gSeqNum++;
	cur_TCB->ack = gAckNum;
	cur_TCB->status = CLOSED;
	return cur_TCB->sockfd;
}
int getSockfd(int sockfd) {
	TCB_LinkList * cur_Entry = TCB_Table;
	while (cur_TCB != NULL && cur_Entry->tcb != NULL) {
		if (cur_Entry->tcb->sockfd == sockfd) {
			cur_TCB = cur_Entry->tcb;
			return 0;
		}
		cur_Entry = cur_Entry->next;
	}
	if (cur_Entry == NULL) 
		return -1;
}
int stud_tcp_connect(int sockfd, struct sockaddr_in *addr, int addrlen)
{
	if (getSockfd(sockfd) == -1)
		return -1;
	UINT32 srcAddr = getIpv4Address();
	UINT32 dstAddr = htonl(addr->sin_addr.s_addr);

	// addr in cur_TCB is network byte order
	cur_TCB->srcAddr = srcAddr;
	cur_TCB->dstAddr = dstAddr;
	cur_TCB->dstPort = ntohs(addr->sin_port);
	cur_TCB->status = SYN_SENT;
	stud_tcp_output(NULL, 0, PACKET_TYPE_SYN, cur_TCB->srcPort, cur_TCB->dstPort, 
		srcAddr, dstAddr);
	TCPHead * receive = new TCPHead;
	int res = -1;
	while(res == -1) {
		res = waitIpPacket((char*)receive, 5000);
	}
	stud_tcp_input((char*)receive, 20, ntohl(cur_TCB->srcAddr), ntohl(cur_TCB->dstAddr));

	return 0;
}

int stud_tcp_send(int sockfd, const unsigned char *pData, unsigned short datalen, int flags)
{
	if (getSockfd(sockfd) == -1)
		return -1;
	if (cur_TCB->status != ESTABLISHED)
		return -1;
	else {
		UINT32 srcAddr = getIpv4Address();
		UINT32 dstAddr = cur_TCB->dstAddr;
		cur_TCB->data = new char(datalen);
		strcpy(cur_TCB->data, (const char*)pData);
		stud_tcp_output((char*)cur_TCB->data, datalen, PACKET_TYPE_DATA, 
			cur_TCB->srcPort, cur_TCB->dstPort, srcAddr, dstAddr);
		TCPHead * receive = new TCPHead;
		int res = -1;
		while (res == -1) {
			res = waitIpPacket((char*)receive, 5000);
		}
		stud_tcp_input((char*)receive, datalen + 20, ntohl(cur_TCB->srcAddr), 
			ntohl(cur_TCB->dstAddr));
	}
	return 0;
}

int stud_tcp_recv(int sockfd, unsigned char *pData, unsigned short datalen, int flags)
{
	if (getSockfd(sockfd) == -1) 
		return -1;
	if (cur_TCB->status != ESTABLISHED)
		return -1;
	else {
		UINT32 srcAddr = getIpv4Address();
		UINT32 dstAddr = cur_TCB->dstAddr;
		TCPHead * receive = new TCPHead;
		int res = -1;
		while (res == -1) {
			res = waitIpPacket((char*)receive, 5000);
		}
		strcpy((char*)pData, receive->data);
		datalen = sizeof(pData);
		stud_tcp_output(NULL, 0, PACKET_TYPE_ACK, cur_TCB->srcPort, 
			cur_TCB->dstPort, srcAddr, dstAddr);
	}
	return 0;
}

int stud_tcp_close(int sockfd)
{
	TCB_LinkList* cur_Entry = TCB_Table;
	TCB_LinkList* preCur = cur_Entry;
	while (cur_Entry != NULL && cur_Entry->tcb != NULL) {
		if (cur_Entry->tcb->sockfd == sockfd) {
			cur_TCB = cur_Entry->tcb;
		}
		preCur = cur_Entry;
		cur_Entry = cur_Entry->next;
	}
	if (cur_Entry == NULL) 
		return -1;

	UINT32 srcAddr = getIpv4Address();
	UINT32 dstAddr = cur_TCB->dstAddr;
	if (cur_TCB->status != ESTABLISHED) {
		if (cur_Entry != preCur) {
			preCur->next = cur_Entry->next;
			delete cur_Entry;
		}else {
			delete cur_TCB;
		}
		cur_TCB = NULL;
		return -1;
	}
	else {
		stud_tcp_output(NULL, 0, PACKET_TYPE_FIN_ACK, cur_TCB->srcPort, cur_TCB->dstPort,
			srcAddr, dstAddr);
		cur_TCB->status = FIN_WAIT1;
		TCPHead* receive = new TCPHead;
		int res = -1;
		while (res == -1) {
			res = waitIpPacket((char*)receive, 5000);
		}
		stud_tcp_input((char*)receive, 20, ntohl(cur_TCB->srcAddr), ntohl(cur_TCB->dstAddr));
		res = -1;
		while(res == -1) {
			res = waitIpPacket((char*)receive, 5000);
		}
		stud_tcp_input((char*)receive, 20, ntohl(cur_TCB->srcAddr), ntohl(cur_TCB->dstAddr));


	}
	return 0;
}
